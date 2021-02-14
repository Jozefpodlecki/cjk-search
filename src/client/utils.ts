export const downloadURI = (dataUri: string, name: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = dataUri;

    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
}