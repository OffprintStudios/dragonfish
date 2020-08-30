export function getQuillHtml(startingElement: Element): string {
    const wrapperDiv = startingElement.querySelector("div.ql-editor");    
    Array.from(wrapperDiv.children).forEach(x => {
      if (x.className === "ql-align-center") {
        x.setAttribute("style", "text-align: center;");
      }
      if (x.className === "ql-align-right") {
        x.setAttribute("style", "text-align: right;");
      }
      if (x.className === "ql-align-jutify") {
        x.setAttribute("style", "text-align:justify;");
      }
    });

    return wrapperDiv.innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');;
  }