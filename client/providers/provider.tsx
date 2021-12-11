import { Alice } from 'nucypher-ts'
import React, { createContext, useContext, useMemo } from 'react'

interface AbioticAliceContextInterface {
	abioticAlice: Alice | undefined
}

export function createAbioticAliceReactRoot()