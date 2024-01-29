
let song = new Audio();
let currentfolder;
let songslist = [];
let seek = document.querySelector("#seekbar");
let currtime = document.querySelector(".seekbar #currtime");
let dur = document.querySelector(".seekbar #duration");
let sname = document.querySelector(".music-info .song");
let sartist = document.querySelector(".music-info .artist");
let r = document.querySelector(':root');
let prevbtn = document.querySelector("#prevbtn");
let playbtn = document.querySelector("#playbtn");
let nextbtn = document.querySelector("#nextbtn");
let searchbox = document.querySelector("#searchbox");
let vol = document.querySelector("#volume");



async function getsongs(folder) {
    let ftch = await fetch(`/tree/master/songs/${folder}`);

    let response = await ftch.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let array = Array.from(as);
    let songs = []
    array.forEach(element => {
        if (element.href.endsWith(".mp3"))
            songs.push(element.href.split(`/${folder.replaceAll(" ","%20")}/`)[1]);
            // console.log(folder)
    });


    // display songs in playlist

    let songdiv = document.querySelector(".songs");
    // console.log(songdiv.innerHTML);
    songdiv.innerHTML = "";

    for (let index = 0; index < songs.length; index++) {
        const element = songs[index];
        let name = songs[index].replaceAll("%20"," ").split("_")[0];
        let artist = songs[index].replaceAll("%20"," ").split("_")[1];

        songdiv.innerHTML = songdiv.innerHTML + `<div class="card">
            <div class="music">
                <img src="svg/music.svg" alt="" width="100">
            </div>
            <div class="info">
                <div class="name">
                    ${name}
                </div>
                <div class="artist">
                    ${artist}
                </div>
            </div>
            <div class="ply">
                <img src="svg/play.svg" alt="">
            </div>
        </div>`;
        // console.log(songs[index])
    }
    return songs;
}

async function getFolder() {
    let ftch = await fetch("/tree/master/songs/");

    let response = await ftch.text();
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let playlists = document.querySelector(".playlists");
    Array.from(as).forEach(element => {
        if (element.href.includes("/songs/")) {
            // console.log(element.href);

            let fname = element.href.split("/")[4];
            playlists.innerHTML = playlists.innerHTML + `<div class="card">
            <div class="cover">
                <img src="songs/${fname}/cover.jpg" alt="cover image" width="100px" height="100px">
            </div>
            <div class="info">
                <h2>${fname.replaceAll("%20"," ")}</h2>
            </div>
        </div>`
        }
    });



    let childs = document.querySelectorAll(".playlists .card");
    if (childs.length < 7) {
        r.style.setProperty('--cols', childs.length);
    } else {
        r.style.setProperty('--cols', "auto-fit");
    }



}






function convert(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);


    var formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? "0" : "") + remainingSeconds;


    var result = formattedMinutes + ":" + formattedSeconds;

    return result;
}


async function main() {
    let list = [];
    let evnot = true;
    await getFolder();







    let playlists = document.querySelectorAll(".playlists .card");
    Array.from(playlists).forEach(async (element) => {

        element.addEventListener("click", async () => {
            let fname = element.querySelector(".info h2");
            currentfolder = fname.innerHTML;
            list = await getsongs(fname.innerHTML);
            songslist = list;

            // console.log(fname.innerHTML)


            let playlistsong = document.querySelectorAll(".songs .card");
            let li = Array.from(playlistsong);

            Array.from(playlistsong).forEach(element => {
                element.addEventListener("click", () => {
                    playsong(list[li.indexOf(element)]);
                })
            });


            let ind = songslist.indexOf(song.currentSrc.split(`/${currentfolder}/`)[1]);
            let cards = document.querySelectorAll(".songs .card");
            if (typeof (cards[ind]) != "undefined" && evnot == true) {
                cards[ind].classList.add("songCardBackground");
                cards[ind].querySelector(".ply").querySelector("img").src = "svg/pause.svg"
            }

            let plistName = document.querySelector("#playlistName");
            plistName.innerHTML = currentfolder;

            searchbox.disabled = false;
            searchbox.defaultValue = "";


            document.querySelector(".left").style.display = "unset";
        })

    })


    function removeCardStyle() {
        let ind = list.indexOf(song.currentSrc.split(`/${currentfolder.replaceAll(" ","%20")}/`)[1]);
        let cards = document.querySelectorAll(".songs .card");
        if (typeof (cards[ind]) != "undefined") {
            cards[ind].classList.remove("songCardBackground");
            cards[ind].querySelector(".ply").querySelector("img").src = "svg/play.svg";
        }
    }

    function playsong(track) {

        removeCardStyle();
        song.pause();
        song.currentTime = 0;
        song.src = `songs/${currentfolder}/` + track;
        song.load();
        var p = song.play();
        if (p !== undefined) p.catch(function () { });
    }




    song.addEventListener('loadedmetadata', () => {
        if (song.duration === Infinity || isNaN(Number(song.duration))) {
            song.currentTime = 1e101;
            song.addEventListener('timeupdate', getDuration);

        }

    });

    function getDuration(event) {
        event.target.currentTime = 0;
        event.target.removeEventListener('timeupdate', getDuration);
    }



    song.addEventListener('timeupdate', () => {
        seek.value = song.currentTime;
        // currtime.innerHTML= song.currentTime;
        currtime.innerHTML = convert(song.currentTime);
    });


    song.addEventListener("playing", () => {
        dur.innerHTML = convert(song.duration);
        
        let name = song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1].replaceAll("%20", " ").split("_")[0];
        let artist = song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1].replaceAll("%20", " ").split("_")[1]

        sname.innerHTML = name;
        sartist.innerHTML = artist;
        sname.classList.add("animate");
        r.style.setProperty('--blue', sname.offsetWidth);

        playbtn.src = "svg/pause.svg";
        seek.max = parseFloat(song.duration);



        let ind = list.indexOf(song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1]);
        let cards = document.querySelectorAll(".songs .card");
        if (typeof (cards[ind]) != "undefined") {
            cards[ind].classList.add("songCardBackground");
            cards[ind].querySelector(".ply").querySelector("img").src = "svg/pause.svg"
        }

        let player = document.querySelector(".player");
        player.style.display = "flex";
        player.style.opacity = "1";
    });





    song.addEventListener("pause", () => {
        sname.classList.remove("animate");
        playbtn.src = "svg/play.svg";

        let ind = list.indexOf(song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1]);
        // console.log()
        let cards = document.querySelectorAll(".songs .card");
        cards[ind].querySelector(".ply").querySelector("img").src = "svg/play.svg";
        // console.log(cards[ind]);
    })

    song.addEventListener("ended", () => {
        sname.classList.remove("animate");
        playbtn.src = "svg/play.svg";
        removeCardStyle();
        nextbtn.click();
    })

    seek.addEventListener('input', () => {
        song.load();
        song.currentTime = seek.value;
        song.load();
        var p = song.play();
        if (p !== undefined) p.catch(function () { });
    });


    playbtn.addEventListener("click", () => {
        if (song.paused) {
            var p = song.play();
            if (p !== undefined) p.catch(function () { });
        } else {
            song.pause();
        }

    });

    nextbtn.addEventListener("click", () => {
        let ind = list.indexOf(song.currentSrc.split(`/${currentfolder.replaceAll(" ","%20")}/`)[1]);
        let next = (ind + 1) % list.length;
        playsong(list[next]);
    })

    prevbtn.addEventListener("click", () => {
        let ind = list.indexOf(song.currentSrc.split(`/${currentfolder.replaceAll(" ","%20")}/`)[1]);
        let prev;
        if (ind == 0) {
            prev = list.length - 1;
        } else {
            prev = ind - 1;
        }
        playsong(list[prev]);
    })

    let songdiv = document.querySelector(".songs");


    searchbox.addEventListener("input", ()=> {
        if (typeof currentfolder != "undefined") {
            let val = searchbox.value.toLowerCase();
            let cardsSearch = list.filter(ele => ele.toLowerCase().includes(val));
            // console.log(card)
            songdiv.innerHTML = " ";

            Array.from(cardsSearch).forEach((ele) => {

                let name = ele.replaceAll("%20", " ").split("_")[0];
                let artist = ele.replaceAll("%20", " ").split("_")[1]


                songdiv.innerHTML = songdiv.innerHTML + `<div class="card">
                    <div class="music">
                        <img src="svg/music.svg" alt="" width="100">
                    </div>
                    <div class="info">
                        <div class="name">
                            ${name}
                        </div>
                        <div class="artist">
                            ${artist}
                        </div>
                    </div>
                    <div class="ply">
                        <img src="svg/play.svg" alt="">
                    </div>
                </div>`;

                document.querySelector(".songs").addEventListener("click", () => {
                    playsong(ele);
                })

            })
            if (songdiv.childElementCount == 0) {
                songdiv.innerHTML = "No match found";
            }
        } else {
            searchbox.disabled = true;
            searchbox.value = "";
            searchbox.defaultValue = "select a playlist"
        }

    })

    document.querySelector(".clear").addEventListener("click", () => {
        searchbox.value = "";
        searchbox.dispatchEvent(new Event('input'));
    })

    vol.addEventListener("input", () => {
        song.volume = vol.value / 100;
    })

    document.querySelector("#backnav").addEventListener("click", () => {
        document.querySelector(".left").style.display = "none";
    })




    window.addEventListener('resize', ()=>{
        if(window.innerWidth>1400){
            document.querySelector(".left").style.display="flex";
        }else{
            document.querySelector(".left").style.display="none"
        }
    });
}

main();
