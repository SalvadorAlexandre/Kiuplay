import { useState } from 'react';

export const usePostBeat = () => {
    const [nomeProdutor, setNomeProdutor] = useState('');
    const [tituloBeat, setTituloBeat] = useState('');
    const [generoBeat, setGeneroBeat] = useState('');
    const [preco, setPreco] = useState('');
    const [tipoLicencaOpen, setTipoLicencaOpen] = useState(false);
    const [tipoLicenca, setTipoLicenca] = useState<string | null>(null);
    const [tipoLicencaItems, setTipoLicencaItems] = useState([
        { label: 'Uso Exclusivo', value: 'exclusivo' },
        { label: 'Uso Livre', value: 'livre' },
    ]);
    const [capaBeat, setCapaBeat] = useState<any>(null);  //HOOKS PARA O QUADRO DA CAPA DO beat
    const [beatFile, setBeatFile] = useState<any>(null);  // Pode usar DocumentPicker para escolher arquivo

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
