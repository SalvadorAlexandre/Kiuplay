// src/hooks/useFormatDateTime.ts

interface FormatDateOptions {
    locale?: string;      // vindo do OS (ex: 'pt-AO', 'en-US')
    showTime?: boolean;   // se true, mostra hora
}

export function formatDate(
    dateInput: string | number | Date,
    { locale = 'default', showTime = false }: FormatDateOptions = {}
): string {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    try {
        return date.toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            ...(showTime && {
                hour: '2-digit',
                minute: '2-digit',
            }),
        });
    } catch {
        return date.toLocaleDateString();
    }
}