export function getQuillHtml(startingElement: Element): string {
    const wrapperDiv = startingElement.querySelector('div.ql-editor');

    wrapperDiv.querySelectorAll('*').forEach((x) => {
        // Replace Quill alignment styles with inline styles
        if (x.className === 'ql-align-center') {
            x.setAttribute('style', 'text-align: center;');
        }
        if (x.className === 'ql-align-right') {
            x.setAttribute('style', 'text-align: right;');
        }
        if (x.className === 'ql-align-jutify') {
            x.setAttribute('style', 'text-align:justify;');
        }

        // Remove ALL <img> elements--they're all Base64, because lol QuillJS
        // sorry authors =(
        if (x.nodeName.toLowerCase() === 'img') {
            x.remove();
        }
    });

    // Replace all newline chars with a <br>, and return the resulting HTML string
    return wrapperDiv.innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');
}
