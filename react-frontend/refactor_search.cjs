const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");

const project = new Project();
project.addSourceFilesAtPaths("src/**/*.tsx");

const files = project.getSourceFiles();

let updatedFilesCount = 0;

for (const file of files) {
  let hasChanges = false;
  
  // Find all JsxElements
  const jsxElements = file.getDescendantsOfKind(SyntaxKind.JsxElement);
  
  const elementsToReplace = [];
  
  for (const element of jsxElements) {
    const openingElement = element.getOpeningElement();
    const tagName = openingElement.getTagNameNode().getText();
    
    if (tagName === "div") {
      // Check if this div is a standard relative wrapper: <div className="relative... group...">
      const classNameAttr = openingElement.getAttribute("className");
      let isWrapper = false;
      let wrapperClassName = "";
      
      if (classNameAttr && classNameAttr.getKind() === SyntaxKind.JsxAttribute) {
        const initializer = classNameAttr.getInitializer();
        if (initializer && initializer.getKind() === SyntaxKind.StringLiteral) {
          const classNameValue = initializer.getLiteralValue();
          if (classNameValue.includes("relative") && (classNameValue.includes("group") || classNameValue.includes("relative flex-1") || classNameValue.includes("relative w-full"))) {
            isWrapper = true;
            wrapperClassName = classNameValue;
          }
        }
      }
      
      if (!isWrapper) continue;
      
      // Check if it contains <Search /> or <Search ... />
      const children = element.getJsxChildren();
      const searchChild = children.find(c => {
        if (c.getKind() === SyntaxKind.JsxSelfClosingElement) {
           return c.getTagNameNode().getText() === "Search";
        }
        if (c.getKind() === SyntaxKind.JsxElement) {
           return c.getOpeningElement().getTagNameNode().getText() === "Search";
        }
        return false;
      });
      
      if (!searchChild) continue;
      
      // Check if it contains an <input ... />
      const inputChild = children.find(c => {
        if (c.getKind() === SyntaxKind.JsxSelfClosingElement) {
           return c.getTagNameNode().getText() === "input";
        }
        if (c.getKind() === SyntaxKind.JsxElement) {
           return c.getOpeningElement().getTagNameNode().getText() === "input";
        }
        return false;
      });
      
      if (!inputChild) continue;
      
      // Extract placeholder, value, onChange from <input>
      const inputNode = inputChild.getKind() === SyntaxKind.JsxElement ? inputChild.getOpeningElement() : inputChild;
      
      let placeholder = "";
      let valueExpr = "";
      let onChangeExpr = "";
      let inputClassName = "";
      
      for (const attr of inputNode.getAttributes()) {
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
               // extract the setSearchTerm from (e) => setSearchTerm(e.target.value)
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
      
      // Skip if valueExpr or onChangeExpr is not easily parsed
      if (!valueExpr) continue;
      
      // We will replace this entire div element with SearchInput!
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
      // If the wrapper had extra classes besides "relative" and "group" that we want to preserve as containerClassName
      let extraContainerClasses = wrapperClassName.split(" ").filter(c => c !== "relative" && c !== "group").join(" ");
      if (extraContainerClasses) {
         newComponentText += `  containerClassName="${extraContainerClasses}"\n`;
      }
      
      newComponentText += `/>`;
      
      elementsToReplace.push({ element, newComponentText });
    }
  }

  // Sort elements in reverse order of their positions
  elementsToReplace.sort((a, b) => b.element.getPos() - a.element.getPos());

  for (const { element, newComponentText } of elementsToReplace) {
      element.replaceWithText(newComponentText);
      hasChanges = true;
  }
  
  if (hasChanges) {
    // Check if SearchInput is imported
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

console.log(`Successfully refactored search inputs in ${updatedFilesCount} files.`);
