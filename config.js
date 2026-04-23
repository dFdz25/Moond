tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                moon: {
                    light: '#E2D4FF',
                    base: '#C4B5FD',
                    dark: '#8B5CF6',
                    bg: '#121212',
                    card: '#1E1E1E',
                    section: '#2A2A2A',
                    border: '#3A3A3A'
                },
                sun: {
                    bg: '#F3F4F6',
                    card: '#FFFFFF',
                    section: '#F9FAFB',
                    border: '#E5E7EB'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        }
    }
}