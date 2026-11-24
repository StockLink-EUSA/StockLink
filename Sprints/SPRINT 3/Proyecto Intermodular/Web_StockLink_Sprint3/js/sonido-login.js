// sonido-login.js
// Reproduce un sonido suave al iniciar sesión.
// El sonido se genera con la Web Audio API (no usa archivos de audio):
// dos notas cortas y agudas, de volumen bajo, que se apagan solas.
// Solo actúa en formularios con el atributo data-sonido-login.

(function () {
    var formulario = document.querySelector("form[data-sonido-login]");
    var AudioCtx = window.AudioContext || window.webkitAudioContext;

    if (!formulario || !AudioCtx) {
        return;
    }

    var VOLUMEN = 0.12;      // volumen máximo (0 a 1); bajo para que no moleste
    var ESPERA_MS = 650;     // tiempo que se espera para que suene antes de cambiar de página
    var enviando = false;

    // Una nota con subida rápida y bajada suave
    function reproducirNota(contexto, frecuencia, inicio, duracion) {
        var oscilador = contexto.createOscillator();
        var volumen = contexto.createGain();

        oscilador.type = "sine";
        oscilador.frequency.value = frecuencia;

        volumen.gain.setValueAtTime(0.0001, inicio);
        volumen.gain.exponentialRampToValueAtTime(VOLUMEN, inicio + 0.015);
        volumen.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);

        oscilador.connect(volumen);
        volumen.connect(contexto.destination);

        oscilador.start(inicio);
        oscilador.stop(inicio + duracion + 0.05);
    }

    function reproducirSonidoLogin() {
        var contexto = new AudioCtx();
        var ahora = contexto.currentTime;

        reproducirNota(contexto, 659.25, ahora, 0.35);          // Mi5
        reproducirNota(contexto, 987.77, ahora + 0.11, 0.45);   // Si5

        // Libera el contexto de audio cuando ha terminado
        setTimeout(function () {
            contexto.close();
        }, 1000);
    }

    formulario.addEventListener("submit", function (evento) {
        // Si otra validación ya ha frenado el envío, no suena nada
        if (evento.defaultPrevented || enviando) {
            return;
        }

        enviando = true;
        evento.preventDefault();

        try {
            reproducirSonidoLogin();
        } catch (error) {
            // Si el navegador no deja reproducir audio, se entra igualmente
        }

        // submit() no vuelve a lanzar este evento, así que no hay bucle
        setTimeout(function () {
            formulario.submit();
        }, ESPERA_MS);
    });
})();
