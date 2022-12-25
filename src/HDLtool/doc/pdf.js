const vscode = require('vscode');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const { makeShowHTML } = require('./html');
const opeParam = require('../../param');
const HDLPath = require('../../HDLfilesys/operation/path');


/**
 * @description transform a html file to pdf file
 * @param {string} htmlPath absolute path of input html
 * @param {string} pdfPath output path of pdf
*/
async function htmlFile2PdfFile(htmlPath, pdfPath) {    
    const pdfConfig = vscode.workspace.getConfiguration("TOOL.doc.pdf");
    if (!fs.existsSync(pdfConfig.browserPath)) {
        vscode.window.showErrorMessage("Path " + pdfConfig.browserPath + " is not a valid browser path!");
        return;
    }
    const browser = await puppeteer.launch({
        executablePath: pdfConfig.browserPath,
        args: ['--lang=' + vscode.env.language, '--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const uriFilePath = vscode.Uri.file(htmlPath).toString();

    await page.goto(uriFilePath, { waitUntil: 'networkidle0' });

    const options = {
        path: pdfPath,
        scale: pdfConfig.scale,
        displayHeaderFooter: pdfConfig.displayHeaderFooter,
        headerTemplate: pdfConfig.headerTemplate,
        footerTemplate: pdfConfig.footerTemplate,
        printBackground: pdfConfig.printBackground,
        landscape: pdfConfig.landscape,
        format: pdfConfig.format,
        margin: {
            top: pdfConfig.margin.top + 'cm',
            right: pdfConfig.margin.right + 'cm',
            bottom: pdfConfig.margin.bottom + 'cm',
            left: pdfConfig.margin.left + 'cm'
        }
    };
    await page.pdf(options);
    await browser.close();
}

function exportCurrentFileDocAsPDF() {
    const editor = vscode.window.activeTextEditor;
    const currentFilePath = HDLPath.toSlash(editor.document.fileName);
    const HDLFileName = HDLPath.basename(currentFilePath);
    const wsPath = opeParam.workspacePath;

    const html = makeShowHTML("pdf");

    if (!html) {
        return;
    }

    return vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: '[Digital-IDE]: Export ' + currentFilePath + '...'
    }, async () => {
        try {
            const pdfFolderPath = HDLPath.join(wsPath, 'pdf');
            if (!fs.existsSync(pdfFolderPath)) {
                fs.mkdirSync(pdfFolderPath);
            }
        
            const pdfName = HDLFileName + '.pdf';
            const pdfPath = HDLPath.join(pdfFolderPath, pdfName);
            if (fs.existsSync(pdfPath)) {
                HDLPath.deleteFolder(pdfPath);
            }
        
            const tempHtmlName = HDLFileName + '.tmp.html';
            const tempHtmlPath = HDLPath.join(pdfFolderPath, tempHtmlName);
            if (fs.existsSync(tempHtmlPath)) {
                HDLPath.deleteFolder(tempHtmlPath);
            }
        
            fs.writeFileSync(tempHtmlPath, html);
            await htmlFile2PdfFile(tempHtmlPath, pdfPath);
            HDLPath.deleteFile(tempHtmlPath);
        } catch (error) {
            console.log("error happen in export pdf: ", error);
        }
    });
}

function exportProjectDocAsPDF() {
    vscode.window.showInformationMessage('this is exportProjectDocAsPDF');   
}


module.exports = {
    exportCurrentFileDocAsPDF,
    exportProjectDocAsPDF
}