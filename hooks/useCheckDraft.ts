import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
    getPendingAlbum, 
    getPendingEP,
} from '@/src/api/uploadContentApi';

export const useCheckDrafts = () => {
    const [hasEPDraft, setHasEPDraft] = useState(false);
    const [hasAlbumDraft, setHasAlbumDraft] = useState(false);
    const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);

    const checkAllDrafts = useCallback(async () => {
        setIsLoadingDrafts(true);
        try {
            // Executamos ambos. Se um falhar, o Promise.all vai para o catch.
            const [epRes, albumRes] = await Promise.all([
                getPendingEP().catch(() => ({ success: false })), // Catch individual
                getPendingAlbum().catch(() => ({ success: false })) // Catch individual
            ]);

            // Caso 1: Só EP tem rascunho
            // Caso 2: Só Album tem rascunho
            // Caso 3: Ambos têm
            // Caso 4: Nenhum tem
            setHasEPDraft(!!(epRes?.success && epRes?.ep));
            setHasAlbumDraft(!!(albumRes?.success && albumRes?.album));

        } catch (error) {
            console.log("Erro crítico na verificação de rascunhos:", error);
        } finally {
            setIsLoadingDrafts(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            checkAllDrafts();
        }, [checkAllDrafts])
    );

    return { hasEPDraft, hasAlbumDraft, isLoadingDrafts };
};