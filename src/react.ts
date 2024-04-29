//  wraps LitElement components as React components for better DevEx

import { createComponent, type EventName } from '@lit/react'
import * as React from 'react'
import AstraButton from './components/button'
import AstraCard from './components/card'
import AstraInput from './components/input'
import AstraLabel from './components/label'
import AstraSelect from './components/select'

const Button = createComponent({
    tagName: 'astra-button',
    elementClass: AstraButton,
    react: React,

    events: {
        onClick: 'click' as EventName<MouseEvent>,
    },
})

const Card = createComponent({
    tagName: 'astra-card',
    elementClass: AstraCard,
    react: React,
})

const Input = createComponent({
    tagName: 'astra-input',
    elementClass: AstraInput,
    react: React,
})

const Label = createComponent({
    tagName: 'astra-label',
    elementClass: AstraLabel,
    react: React,
})

const Select = createComponent({
    tagName: 'astra-select',
    elementClass: AstraSelect,
    react: React,
})

export default { Select, Label, Input, Card, Button }
