const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");

const project = new Project();
project.addSourceFilesAtPaths("src/**/*.tsx");

const files = project.getSourceFiles();

let updatedFilesCount = 0;

for (const file of files) {
  let hasChanges = false;
  
  const jsxElements = [...file.getDescendantsOfKind(SyntaxKind.JsxElement), ...file.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)];
  
  const elementsToReplace = [];
  
  for (const element of jsxElements) {
    let openingElement = element;
    if (element.getKind() === SyntaxKind.JsxElement) {
      openingElement = element.getOpeningElement();
    }
    
    const tagName = openingElement.getTagNameNode().getText();
    
    if (tagName === "TextInput") {
      // Check if icon={Search}
      const iconAttr = openingElement.getAttribute("icon");
      if (!iconAttr) continue;
      
      let isSearchIcon = false;
      if (iconAttr.getKind() === SyntaxKind.JsxAttribute) {
        const init = iconAttr.getInitializer();
        if (init && init.getKind() === SyntaxKind.JsxExpression && init.getExpression().getText() === "Search") {
           isSearchIcon = true;
        }
      }
      if (!isSearchIcon) continue;
      
      // Extract placeholder, value, onChange, className
      let placeholder = "";
      let valueExpr = "";
      let onChangeExpr = "";
      let inputClassName = "";
      
      for (const attr of openingElement.getAttributes()) {
        if (attr.getKind() === SyntaxKind.JsxAttribute) {
          const name = attr.getNameNode().getText();
          const init = attr.getInitializer();
          if (name === "placeholder") {
            if (init && init.getKind() === SyntaxKind.StringLiteral) {
              placeholder = init.getText();
            } else if (init && init.getKind() === SyntaxKind.JsxExpression) {
              placeholder = init.getText();
            }
          } else if (name === "value") {
            if (init && init.getKind() === SyntaxKind.JsxExpression) {
              valueExpr = init.getExpression().getText();
            }
          } else if (name === "onChange") {
             if (init && init.getKind() === SyntaxKind.JsxExpression) {
               const arrowFunc = init.getExpression();
               if (arrowFunc && arrowFunc.getKind() === SyntaxKind.ArrowFunction) {
                 const body = arrowFunc.getBody();
                 if (body.getKind() === SyntaxKind.CallExpression) {
                   onChangeExpr = body.getExpression().getText();
                 }
               } else {
                 onChangeExpr = arrowFunc.getText();
               }
             }
          } else if (name === "className") {
            if (init && init.getKind() === SyntaxKind.StringLiteral) {
              inputClassName = init.getLiteralValue();
            }
          }
        }
      }
      
      if (!valueExpr) continue;
      
      let newComponentText = `<SearchInput\n`;
      if (placeholder) {
         newComponentText += `  placeholder=${placeholder}\n`;
      }
      if (valueExpr) {
         newComponentText += `  value={${valueExpr}}\n`;
      }
      if (onChangeExpr) {
         newComponentText += `  onChange={${onChangeExpr}}\n`;
      }
      if (inputClassName) {
         newComponentText += `  containerClassName="${inputClassName}"\n`;
      }
      
      newComponentText += `/>`;
      
      elementsToReplace.push({ element, newComponentText });
    }
  }

  elementsToReplace.sort((a, b) => b.element.getPos() - a.element.getPos());

  for (const { element, newComponentText } of elementsToReplace) {
      element.replaceWithText(newComponentText);
      hasChanges = true;
  }
  
  if (hasChanges) {
    const importDeclarations = file.getImportDeclarations();
    const hasSearchInputImport = importDeclarations.some(imp => 
      imp.getImportClause() && imp.getImportClause().getText().includes("SearchInput")
    );
    
    if (!hasSearchInputImport) {
      file.addImportDeclaration({
        defaultImport: "SearchInput",
        moduleSpecifier: "@/components/common/SearchInput"
      });
    }
    
    console.log(`Updated ${file.getFilePath()}`);
    file.saveSync();
    updatedFilesCount++;
  }
}

console.log(`Successfully refactored TextInput to SearchInput in ${updatedFilesCount} files.`);
