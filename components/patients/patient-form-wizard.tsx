'use client'

import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, Save, User, Phone, MapPin, Heart, FileText } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
// Hooks são utilizados nos componentes filhos
import { pacienteSchema, PacienteFormData, PacienteFormSteps } from '@/lib/validations/paciente'
import { createClient } from '@/lib/supabase'

// Componentes das etapas
import { DadosPessoaisStep } from './form-steps/dados-pessoais-step'
import { ContatoStep } from './form-steps/contato-step'
import { EnderecoStep } from './form-steps/endereco-step'
import { EmergenciaStep } from './form-steps/emergencia-step'
import { MedicoStep } from './form-steps/medico-step'
import { DocumentUpload } from './document-upload'
import { DocumentList } from './document-list'

interface PatientFormWizardProps {
  initialData?: Partial<PacienteFormData & { id?: string }>
  onSuccess?: (patient: any) => void
  onCancel?: () => void
  mode?: 'create' | 'edit'
}

const STEPS = [
  {
    id: 'dadosPessoais',
    title: 'Dados Pessoais',
    description: 'Informações básicas do paciente',
    icon: User,
    required: true
  },
  {
    id: 'contato',
    title: 'Contato',
    description: 'Telefone, email e redes sociais',
    icon: Phone,
    required: true
  },
  {
    id: 'endereco',
    title: 'Endereço',
    description: 'Localização e dados de endereço',
    icon: MapPin,
    required: true
  },
  {
    id: 'emergencia',
    title: 'Emergência',
    description: 'Contato de emergência',
    icon: Heart,
    required: false
  },
  {
    id: 'medico',
    title: 'Informações Médicas',
    description: 'Histórico, alergias e medicamentos',
    icon: FileText,
    required: false
  },
  {
    id: 'documentos',
    title: 'Documentos',
    description: 'Upload de documentos',
    icon: FileText,
    required: false
  }
] as const

type StepId = typeof STEPS[number]['id']

export function PatientFormWizard({ 
  initialData, 
  onSuccess, 
  onCancel, 
  mode = 'create' 
}: PatientFormWizardProps) {
  const [currentStep, setCurrentStep] = useState<StepId>('dadosPessoais')
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [documentRefresh, setDocumentRefresh] = useState(0)
  const { toast } = useToast()
  const supabase = createClient()

  // Configurar formulário com React Hook Form
  const methods = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: initialData || {},
    mode: 'onChange'
  })

  const { handleSubmit, watch, formState: { errors, isValid } } = methods
  const watchedValues = watch()

  // Auto-save draft a cada 30 segundos
  useEffect(() => {
    if (mode === 'create') {
      const interval = setInterval(() => {
        saveDraft()
      }, 30000) // 30 segundos

      return () => clearInterval(interval)
    }
  }, [watchedValues, mode])

  // Carregar draft salvo ao inicializar
  useEffect(() => {
    if (mode === 'create' && !initialData) {
      loadDraft()
    }
  }, [mode, initialData])

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  // Verificar se a etapa atual está válida
  const isCurrentStepValid = () => {
    const step = STEPS[currentStepIndex]
    if (!step.required) return true

    switch (step.id) {
      case 'dadosPessoais':
        return !errors.nome_completo && !errors.cpf && !errors.data_nascimento && !errors.genero &&
               watchedValues.nome_completo && watchedValues.cpf && watchedValues.data_nascimento && watchedValues.genero
      case 'contato':
        return !errors.telefone_celular && !errors.email &&
               watchedValues.telefone_celular && watchedValues.email
      case 'endereco':
        return !errors.cep && !errors.logradouro && !errors.numero && !errors.bairro && !errors.cidade && !errors.uf &&
               watchedValues.cep && watchedValues.logradouro && watchedValues.numero && watchedValues.bairro && watchedValues.cidade && watchedValues.uf
      default:
        return true
    }
  }

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      if (isCurrentStepValid()) {
        setCompletedSteps(prev => new Set([...Array.from(prev), currentStep]))
        setCurrentStep(STEPS[currentStepIndex + 1].id)
      } else {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios antes de continuar.",
          variant: "destructive"
        })
      }
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id)
    }
  }

  const goToStep = (stepId: StepId) => {
    const targetIndex = STEPS.findIndex(step => step.id === stepId)
    const currentIndex = STEPS.findIndex(step => step.id === currentStep)
    
    // Só permite ir para etapas anteriores ou próxima se a atual estiver válida
    if (targetIndex <= currentIndex || isCurrentStepValid()) {
      if (isCurrentStepValid()) {
        setCompletedSteps(prev => new Set([...Array.from(prev), currentStep]))
      }
      setCurrentStep(stepId)
    }
  }

  const saveDraft = async () => {
    console.log('saveDraft called')
    if (isDraftSaving) return
    
    setIsDraftSaving(true)
    try {
      // Preparar dados para salvamento
      const draftData = {
        nome_completo: watchedValues.nome_completo || null,
        cpf: watchedValues.cpf || null,
        data_nascimento: watchedValues.data_nascimento || null,
        genero: watchedValues.genero || null,
        rg: watchedValues.rg || null,
        orgao_emissor_rg: watchedValues.orgao_emissor_rg || null,
        uf_rg: watchedValues.uf_rg || null,
        estado_civil: watchedValues.estado_civil || null,
        profissao: watchedValues.profissao || null,
        telefone_celular: watchedValues.telefone_celular || null,
        telefone_fixo: watchedValues.telefone_fixo || null,
        email: watchedValues.email || null,
        cep: watchedValues.cep || null,
        logradouro: watchedValues.logradouro || null,
        numero: watchedValues.numero || null,
        complemento: watchedValues.complemento || null,
        bairro: watchedValues.bairro || null,
        cidade: watchedValues.cidade || null,
        uf: watchedValues.uf || null,
        nome_emergencia: watchedValues.contato_emergencia_nome || null,
      parentesco_emergencia: watchedValues.contato_emergencia_parentesco || null,
      telefone_emergencia: watchedValues.contato_emergencia_telefone || null,
        convenio_medico: watchedValues.convenio_medico || null,
        numero_carteirinha: watchedValues.numero_carteirinha || null,
        historico_medico_detalhado: watchedValues.historico_medico_detalhado || null,
        alergias_conhecidas: watchedValues.alergias_conhecidas || null,
        medicamentos_uso: watchedValues.medicamentos_uso || null,
        observacoes_gerais: watchedValues.observacoes_gerais || null,
        tipo_sanguineo: watchedValues.tipo_sanguineo || null,
        whatsapp_id: watchedValues.whatsapp_id || null,
        instagram_id: watchedValues.instagram_id || null,
        status: 'rascunho',
        lastSaved: new Date().toISOString()
      }
      
      // Salvar no localStorage como backup
      localStorage.setItem('patient-form-draft', JSON.stringify(draftData))
      
      // Se há dados suficientes, salvar no banco
      if (watchedValues.nome_completo && watchedValues.cpf) {
        const { error } = await supabase
          .from('pacientes')
          .upsert([draftData], { onConflict: 'cpf' })
        
        if (error) {
           console.error('Erro ao salvar rascunho no banco:', error)
         } else {
           toast({
             title: "Rascunho salvo",
             description: "Seus dados foram salvos automaticamente."
           })
         }
      }
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error)
    } finally {
      setIsDraftSaving(false)
    }
  }

  const loadDraft = async () => {
    try {
      // Primeiro tentar carregar do localStorage
      const localDraftData = localStorage.getItem('patient-form-draft')
      if (localDraftData) {
        const parsed = JSON.parse(localDraftData)
        methods.reset(parsed)
        toast({
          title: "Rascunho carregado",
          description: "Seus dados foram restaurados do armazenamento local."
        })
        return
      }
      
      // Se não há dados locais, tentar carregar rascunhos do banco
      const { data: drafts, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('status', 'rascunho')
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (error) {
        console.error('Erro ao carregar rascunhos do banco:', error)
        return
      }
      
      if (drafts && drafts.length > 0) {
        const draft = drafts[0]
        methods.reset(draft)
        toast({
          title: "Rascunho encontrado",
          description: "Encontramos um rascunho salvo anteriormente."
        })
      }
    } catch (error) {
      console.error('Erro ao carregar rascunho:', error)
    }
  }

  const clearDraft = () => {
    localStorage.removeItem('patient-form-draft')
  }

  const onSubmit = async (data: PacienteFormData) => {
    console.log('onSubmit called with data:', data)
    setIsSubmitting(true)
    
    try {
      // Verificar duplicata por CPF
      const { data: existingPatient } = await supabase
        .from('pacientes')
        .select('id, nome_completo')
        .eq('cpf', data.cpf)
        .single()

      if (existingPatient && mode === 'create') {
        toast({
          title: "CPF já cadastrado",
          description: `Já existe um paciente cadastrado com este CPF: ${existingPatient.nome_completo}`,
          variant: "destructive"
        })
        return
      }

      // Preparar dados para inserção/atualização
      const patientData = {
        ...data,
        // Converter campos vazios para null
        rg: data.rg || null,
        orgao_emissor_rg: data.orgao_emissor_rg || null,
        uf_rg: data.uf_rg || null,
        estado_civil: data.estado_civil || null,
        profissao: data.profissao || null,
        telefone_fixo: data.telefone_fixo || null,
        complemento: data.complemento || null,
        nome_emergencia: data.contato_emergencia_nome || null,
        parentesco_emergencia: data.contato_emergencia_parentesco || null,
        telefone_emergencia: data.contato_emergencia_telefone || null,
        convenio_medico: data.convenio_medico || null,
        numero_carteirinha: data.numero_carteirinha || null,
        historico_medico_detalhado: data.historico_medico_detalhado || null,
        alergias_conhecidas: data.alergias_conhecidas || null,
        medicamentos_uso: data.medicamentos_uso || null,
        observacoes_gerais: data.observacoes_gerais || null,
        tipo_sanguineo: data.tipo_sanguineo || null,
        whatsapp_id: data.whatsapp_id || null,
        instagram_id: data.instagram_id || null
      }

      let result
      if (mode === 'create') {
        const { data: newPatient, error } = await supabase
          .from('pacientes')
          .insert([patientData])
          .select()
          .single()

        if (error) throw error
        result = newPatient
        clearDraft() // Limpar rascunho após sucesso
      } else {
        const { data: updatedPatient, error } = await supabase
          .from('pacientes')
          .update(patientData)
          .eq('id', initialData?.id)
          .select()
          .single()

        if (error) throw error
        result = updatedPatient
      }

      toast({
        title: mode === 'create' ? "Paciente cadastrado" : "Paciente atualizado",
        description: `${data.nome_completo} foi ${mode === 'create' ? 'cadastrado' : 'atualizado'} com sucesso.`
      })

      onSuccess?.(result)
    } catch (error: any) {
      console.error('Erro ao salvar paciente:', error)
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'dadosPessoais':
        return <DadosPessoaisStep />
      case 'contato':
        return <ContatoStep />
      case 'endereco':
        return <EnderecoStep />
      case 'emergencia':
        return <EmergenciaStep />
      case 'medico':
        return <MedicoStep />
      case 'documentos':
        return initialData?.id ? (
          <div className="space-y-6">
            <DocumentUpload 
              pacienteId={initialData.id} 
              onDocumentUploaded={() => setDocumentRefresh(prev => prev + 1)}
            />
            <DocumentList 
              pacienteId={initialData.id} 
              refreshTrigger={documentRefresh}
            />
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Salve o paciente primeiro para fazer upload de documentos</div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">


      {/* Progress - apenas no modo de criação */}
      {mode === 'create' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Steps Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = currentStep === step.id
          const isAccessible = index <= currentStepIndex || isCompleted
          
          return (
            <Button
              key={step.id}
              variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
              size="sm"
              className={`flex items-center gap-2 ${!isAccessible ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isAccessible && goToStep(step.id)}
              disabled={!isAccessible}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{step.title}</span>

              {isCompleted && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </Button>
          )
        })}
      </div>

      {/* Auto-save indicator */}
      {isDraftSaving && (
        <Alert>
          <Save className="h-4 w-4" />
          <AlertDescription>
            Salvando rascunho automaticamente...
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(STEPS[currentStepIndex].icon, { className: "h-5 w-5" })}
                {STEPS[currentStepIndex].title}

              </CardTitle>
              <CardDescription>
                {STEPS[currentStepIndex].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                disabled={isDraftSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isDraftSaving ? 'Salvando...' : 'Salvar Rascunho'}
              </Button>
              
              {currentStepIndex < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isCurrentStepValid()}
                >
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : (mode === 'create' ? 'Cadastrar Paciente' : 'Atualizar Paciente')}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}