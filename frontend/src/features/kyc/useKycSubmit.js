import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabaseClient'

export function useKycSubmit() {
  return useMutation({
    mutationFn: async ({ nin, bvn, selfieFile, idDocumentFile }) => {
      // Upload files to storage
      const uploads = {}

      if (idDocumentFile) {
        const { data: idData, error: idError } = await supabase.storage
          .from('kyc-documents')
          .upload(`${Date.now()}_${idDocumentFile.name}`, idDocumentFile)

        if (idError) throw idError
        uploads.idDocumentUrl = idData.path
      }

      if (selfieFile) {
        const { data: selfieData, error: selfieError } = await supabase.storage
          .from('kyc-selfies')
          .upload(`${Date.now()}_${selfieFile.name}`, selfieFile)

        if (selfieError) throw selfieError
        uploads.selfieUrl = selfieData.path
      }

      // Create KYC verification record via Edge Function
      const { data, error } = await supabase.functions.invoke('kyc-submit', {
        body: {
          nin,
          bvn,
          selfie_url: uploads.selfieUrl,
          id_document_url: uploads.idDocumentUrl
        }
      })

      if (error) throw error
      return data
    }
  })
}
