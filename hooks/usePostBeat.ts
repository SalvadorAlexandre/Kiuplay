import { useState, useEffect } from 'react';
import { useTranslation } from '@/src/translations/useTranslation';

export const usePostBeat = () => {

    const { t} = useTranslation();

    const [nomeProdutor, setNomeProdutor] = useState('');
    const [tituloBeat, setTituloBeat] = useState('');
    const [generoBeat, setGeneroBeat] = useState('');
    const [preco, setPreco] = useState('');
    const [tipoLicencaOpen, setTipoLicencaOpen] = useState(false);
    const [tipoLicenca, setTipoLicenca] = useState<string | null>(null);
    const [tipoLicencaItems, setTipoLicencaItems] = useState<any[]>([]);
    const [capaBeat, setCapaBeat] = useState<any>(null);  //HOOKS PARA O QUADRO DA CAPA DO beat
    const [beatFile, setBeatFile] = useState<any>(null);  // Pode usar DocumentPicker para escolher arquivo


    // ✅ Atualiza os textos das opções sempre que o idioma mudar
    useEffect(() => {
        setTipoLicencaItems([
            { label: t('postBeat.licenseTypes.exclusive'), value: 'exclusivo' },
            { label: t('postBeat.licenseTypes.free'), value: 'livre' },
        ]);
    }, [t]);

    return {
        nomeProdutor, setNomeProdutor,
        tituloBeat, setTituloBeat,
        generoBeat, setGeneroBeat,
        preco, setPreco,
        tipoLicencaOpen, setTipoLicencaOpen,
        tipoLicenca, setTipoLicenca,
        tipoLicencaItems, setTipoLicencaItems,
        capaBeat, setCapaBeat,
        beatFile, setBeatFile,
    };
};