document.addEventListener('DOMContentLoaded', () => 
    {
        const notepad = document.getElementById('notepad');
        const saveButton = document.getElementById('save-button');
        const clearButton = document.getElementById('clear-button');
        const videoUrlInput = document.getElementById('video-url');
        const embedButton = document.getElementById('embed-button');
        //const videoPlayer = document.getElementById('video-player');
        const videoWrapper = document.querySelector('.video-wrapper');
        let player;
    
        // Save notes to local storage
        saveButton.addEventListener('click', () => 
        {
            const filename = prompt('Enter filename (without extension):') || 'my-notes';
            const blob = new Blob([notepad.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${filename}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a); // Clean up
        });
    
        // Clear notes
        clearButton.addEventListener('click', () => 
        {
            notepad.value = '';
            localStorage.removeItem('notes');
        });
    
        // Load saved notes from local storage on page load
        notepad.value = localStorage.getItem('notes') || '';
    
        // Embed Video
        //embedButton.addEventListener('click', () => {
        //    const videoUrl = videoUrlInput.value; // Get the value from the input field
        //    const videoId = extractVideoId(videoUrl);
        //    if (videoId) {
        //        embed(videoId);
        //    } else {
        //        alert("Invalid YouTube URL");
        //    }
        //});
    //
        //function extractVideoId(url) {
        //    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        //    const match = url.match(regex);
        //    return match ? match[1] : null;
        //}
    //
        //function embed(id) {
        //    var embedlink = "https://www.youtube.com/embed/" + id; // https://www.youtube.com/embed/sGbxmsDFVnE
        //    videoPlayer.src = embedlink;
        //}
    //
        
        // Embed Video.
        embedButton.addEventListener('click', () => {
            const videoUrl = videoUrlInput.value; // Get the value from the input field
            const videoId = extractVideoId(videoUrl);
            if (videoId) {
                embed(videoId);
            } else {
                alert("Invalid YouTube URL");
            }
        });
    
        function extractVideoId(url) {
            const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(regex);
            return match ? match[1] : null;
        }
    
        function embed(id) {
            if (player) {
                player.destroy();
            }
            videoWrapper.innerHTML = '<div id="video-player"></div>';
            player = new YT.Player('video-player', {
                height: '390',
                width: '640',
                videoId: id,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    
        // BackUp Check on Console.
        function onPlayerReady(event) {
            // Player is ready
            console.log('Player is ready');
        }
        // Get TimeStamp of video when video is paused.
        function onPlayerStateChange(event) {
            const state = player.getPlayerState();
            console.log('Player state changed:', state);
            if (state === YT.PlayerState.PAUSED) {
                const currentTime = player.getCurrentTime();
                console.log('Video paused at:', currentTime);
                const minutes = Math.floor(currentTime / 60);
                const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
                const timestamp = `${minutes}:${seconds}`;
                notepad.value += `\n${timestamp}: `;
            }
        }
    
        $(function() {
            $('.scroll-down').click(function () {
                $('html, body').animate({ scrollTop: $('#video-section').offset().top }, 'slow');
                return false;
            });
        });
    
        // Load YouTube Iframe API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
        
    