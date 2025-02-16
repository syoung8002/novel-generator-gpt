/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                    lightgrey: '#F5F5F5'
                }
            },
            dark: {
                colors: {
                    primary: '#BB86FC',
                    secondary: '#03DAC6',
                    accent: '#03DAC6',
                    error: '#CF6679',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                    lightgrey: '#F5F5F5'
                }
            }
        }
    },
    defaults: {
        VCard: {
            rounded: 'xl'
        },
        VTextField: {
            variant: 'outlined',
            density: 'comfortable',
            color: 'info'
        },
        VStepper: {
            variant: 'outlined',
            density: 'comfortable',
            color: 'info'
        },
        VTextarea: {
            variant: 'plain',
            density: 'comfortable',
            color: 'info'
        },
        VSelect: {
            variant: 'outlined',
            density: 'comfortable',
            color: 'info'
        },
        VCombobox: {
            variant: 'outlined',
            density: 'comfortable',
            color: 'info'
        },
        VCheckbox: {
            density: 'comfortable',
            color: 'info'
        },
        VListItem: {
            minHeight: '45px'
        },
        VTooltip: {
            location: 'top'
        },
        VBtn: {
            color: 'info'
        }
    }
})
