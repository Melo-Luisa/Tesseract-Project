// variaveis para os elementos do DOM
const inputImagem = document.getElementById("imagem");
const botao = document.getElementById("lerTexto");
const resultado = document.getElementById("resultado");
const status = document.getElementById("status");
const preview = document.getElementById("preview");
// botão de copiar texto
const botaoCopiar = document.getElementById("copiarTexto");
// event listener para o botão de copiar texto
botaoCopiar.addEventListener("click", () => {
    if (resultado.value.trim() === "") {
        alert("Não há texto para copiar.");
        return;
    }

    resultado.select();
    document.execCommand("copy");
    alert("Texto copiado para a área de transferência!");
});
// event listener para o input de imagem
inputImagem.addEventListener("change", () => {
    const imagem = inputImagem.files[0];
    if (imagem) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(imagem);
        preview.style.display = "block";
    }
});
// event listener para o botão de ler texto
botao.addEventListener("click", async () => {

    const imagem = inputImagem.files[0];

    if (!imagem) {
        alert("Selecione uma imagem primeiro.");
        return;
    }

    try {

        status.textContent = "Inicializando Tesseract...";
        resultado.value = "";

        console.log("Tesseract:", Tesseract);

       const worker = await Tesseract.createWorker("por", 1, {

            workerPath: "./node_modules/tesseract.js/dist/worker.min.js",

            corePath: "./node_modules/tesseract.js-core",

            langPath: "./tessdata",

            logger: info => {

                console.log(info);

                if (info.status) {
                    const progresso = Math.round(
                        (info.progress || 0) * 100
                    );

                    status.textContent =
                        `${info.status} - ${progresso}%`;
                }
            }
        });

        status.textContent = "Lendo imagem...";

        const resultadoOCR = await worker.recognize(imagem);

        console.log("Resultado:", resultadoOCR);

        resultado.value = resultadoOCR.data.text;

        status.textContent = "OCR concluído!";

        await worker.terminate();

    } catch (erro) {

        console.error("ERRO:", erro);

        status.textContent = "Erro no OCR.";

        resultado.value = erro;
    }
});