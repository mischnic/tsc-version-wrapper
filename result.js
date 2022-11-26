export function createImportClause(factory: any, isTypeOnly: boolean, name: Identifier | void, namedBindings: NamedImportBindings | void): ImportClause {
	if (majorVersion > 4 || (majorVersion === 4 && minorVersion >= 0)) {
		return factory.createImportClause(
			isTypeOnly,
			name,
			namedBindings
		);
	} else if (majorVersion > 3 || (majorVersion === 3 && minorVersion >= 8)) {
		return factory.createImportClause(
			name,
			namedBindings,
			isTypeOnly
		);
	} else if (majorVersion > 3 || (majorVersion === 3 && minorVersion >= 0)) {
		return factory.createImportClause(
			name,
			namedBindings
		);
	} else {
		invariant(false);
	}
}

export function createImportDeclaration(factory: any, modifiers: Modifier[] | void, importClause: ImportClause | void, moduleSpecifier: Expression, assertClause: AssertClause): ImportDeclaration {
	if (majorVersion > 4 || (majorVersion === 4 && minorVersion >= 8)) {
		return factory.createImportDeclaration(
			modifiers,
			importClause,
			moduleSpecifier,
			assertClause
		);
	} else if (majorVersion > 4 || (majorVersion === 4 && minorVersion >= 5)) {
		return factory.createImportDeclaration(
			undefined /* decorators */,
			modifiers,
			importClause,
			moduleSpecifier,
			assertClause
		);
	} else if (majorVersion > 3 || (majorVersion === 3 && minorVersion >= 0)) {
		return factory.createImportDeclaration(
			undefined /* decorators */,
			modifiers,
			importClause,
			moduleSpecifier
		);
	} else {
		invariant(false);
	}
}

export function createImportSpecifier(factory: any, isTypeOnly: boolean, propertyName: Identifier | void, name: Identifier): ImportSpecifier {
	if (majorVersion > 4 || (majorVersion === 4 && minorVersion >= 5)) {
		return factory.createImportSpecifier(
			isTypeOnly,
			propertyName,
			name
		);
	} else if (majorVersion > 3 || (majorVersion === 3 && minorVersion >= 0)) {
		return factory.createImportSpecifier(
			propertyName,
			name
		);
	} else {
		invariant(false);
	}
}

export function updateExportDeclaration(factory: any, node: ExportDeclaration, modifiers: Modifier[] | void, isTypeOnly: boolean, exportClause: NamedExportBindings | void, moduleSpecifier: Expression | void, assertClause: AssertClause | void): ExportDeclaration {
	if (majorVersion > 4 || (majorVersion === 4 && minorVersion >= 8)) {
		return factory.updateExportDeclaration(
			node,
			modifiers,
			isTypeOnly,
			exportClause,
			moduleSpecifier,
			assertClause
		);
	} else if (majorVersion > 4 || (majorVersion === 4 && minorVersion >= 5)) {
		return factory.updateExportDeclaration(
			node,
			undefined /* decorators */,
			modifiers,
			isTypeOnly,
			exportClause,
			moduleSpecifier,
			assertClause
		);
	} else if (majorVersion > 4 || (majorVersion === 4 && minorVersion >= 0)) {
		return factory.updateExportDeclaration(
			node,
			undefined /* decorators */,
			modifiers,
			isTypeOnly,
			exportClause,
			moduleSpecifier
		);
	} else if (majorVersion > 3 || (majorVersion === 3 && minorVersion >= 8)) {
		return factory.updateExportDeclaration(
			node,
			undefined /* decorators */,
			modifiers,
			exportClause,
			moduleSpecifier,
			isTypeOnly
		);
	} else if (majorVersion > 3 || (majorVersion === 3 && minorVersion >= 0)) {
		return factory.updateExportDeclaration(
			node,
			undefined /* decorators */,
			modifiers,
			exportClause,
			moduleSpecifier
		);
	} else {
		invariant(false);
	}
}

