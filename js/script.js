


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


    try {
        var { request } = await import("https://cdn.pika.dev/@octokit/request");


        const result = await request(`GET /repos/viivek310/vivek-music-player/contents/songs/${folder.replaceAll("%20"," ")}`);
        var songs = []
        Array.from(result.data).forEach(element => {

            if (element.name.endsWith(".mp3"))
                songs.push(element.name);
        });
        let songdiv = document.querySelector(".songs");
        songdiv.innerHTML = "";

        for (let index = 0; index < songs.length; index++) {
            const element = songs[index];
            let name = songs[index].split("_")[0];
            let artist = songs[index].split("_")[1];
            
                let html=  `<div class="card">
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

                songdiv.insertAdjacentHTML("beforeend",html);
        }
        songarray = Array.from(songs)
        return songs;


    } catch (error) {
        console.error('Error:', error);
    }
}

async function getFolder() {

 

    (async () => {
        try {
            var { request } = await import("https://cdn.pika.dev/@octokit/request");

            const result = await request("GET /repos/viivek310/vivek-music-player/contents/songs");
            let playlists = document.querySelector(".playlists");
            Array.from(result.data).forEach(element => {



                let fname = element.name;
                let html =  `<div class="card">
                  <div class="cover">
                      <img src="https://github.com/viivek310/vivek-music-player/blob/master/songs/${fname}/cover.jpg?raw=true" alt="cover image" width="100px" height="100px">
                  </div>
                  <div class="info">
                      <h2>${fname.replaceAll("%20", " ")}</h2>
                  </div>
              </div>`
              playlists.insertAdjacentHTML("beforeend",html)

            });
        } catch (error) {
            console.error('Error:', error);
        }


        let childs = document.querySelectorAll(".playlists .card");
        if (childs.length < 7) {
            r.style.setProperty('--cols', childs.length);
        } else {
            r.style.setProperty('--cols', "auto-fit");
        }




        let playlists = document.querySelectorAll(".playlists .card");
        Array.from(playlists).forEach((element) => {

            element.addEventListener("click", async () => {
                let fname = element.querySelector(".info h2");
                currentfolder = fname.innerHTML;
                songslist = await getsongs(fname.innerHTML);
              
                // console.log(fname.innerHTML)


                let playlistsong = document.querySelectorAll(".songs .card");

                let li = Array.from(playlistsong);

                Array.from(playlistsong).forEach(element => {
                    element.addEventListener("click", () => {
            
                        playsong(songslist[li.indexOf(element)]);
                    })
                });

                // console.log(list)
                let ind = songslist.indexOf(decodeURIComponent(song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1]));
                // console.log(indson)
                let cards = document.querySelectorAll(".songs .card");
                if (typeof (cards[ind]) != "undefined") {
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
    })();

}






function convert(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);


    var formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? "0" : "") + remainingSeconds;


    var result = formattedMinutes + ":" + formattedSeconds;

    return result;
}






function removeCardStyle() {
    let ind = songslist.indexOf(decodeURIComponent(song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1]));
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
    // track = track.replaceAll("%20"," ");
  
    song.src = `https://raw.githubusercontent.com/viivek310/vivek-music-player/master/songs/${currentfolder}/` + track;
    song.load();
    var p = song.play();
    if (p !== undefined) p.catch(function () { });
}








async function main() {
    let list = [];
    let evnot = true;
    await getFolder();




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

    song.addEventListener("playing", async () => {
        dur.innerHTML = convert(song.duration);
        let name = song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1].replaceAll("%20", " ").split("_")[0];
        let artist = song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1].replaceAll("%20", " ").split("_")[1]

        sname.innerHTML = name;
        sartist.innerHTML = artist;
        sname.classList.add("animate");
        // r.style.setProperty('--blue', sname.offsetWidth);

        playbtn.src = "svg/pause.svg";
        seek.max = parseFloat(song.duration);

        let ind = songslist.indexOf(decodeURIComponent(song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1]));
        let cards = document.querySelectorAll(".songs .card");
        // if (typeof (cards[ind]) != "undefined") {
            cards[ind].classList.add("songCardBackground");
            cards[ind].querySelector(".ply").querySelector("img").src = "svg/pause.svg"
        // }

        let player = document.querySelector(".player");
        player.style.display = "flex";
        player.style.opacity = "1";
    });





    song.addEventListener("pause", () => {
        sname.classList.remove("animate");
        playbtn.src = "svg/play.svg";

        // let templist = await getsongs(currentfolder);
        let ind = songslist.indexOf(decodeURIComponent(song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1]));
 
        let cards = document.querySelectorAll(".songs .card");
    
            cards[ind].querySelector(".ply").querySelector("img").src = "svg/play.svg";
    
      
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
        let ind = songslist.indexOf(decodeURIComponent(song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1]));
        let next =(ind + 1) % songslist.length;
        
        playsong(songslist[next]);
    })

    prevbtn.addEventListener("click", () => {
        let ind = songslist.indexOf(decodeURIComponent(song.currentSrc.split(`/${currentfolder.replaceAll(" ", "%20")}/`)[1]));
        let prev;
        if (ind == 0) {
            prev = songslist.length - 1;
        } else {
            prev = ind - 1;
        }
        playsong(songslist[prev]);
    })

    let songdiv = document.querySelector(".songs");


    searchbox.addEventListener("input", () => {
       
            let val = searchbox.value.toLowerCase();
            let cardsSearch = songslist.filter(ele => ele.toLowerCase().includes(val));
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

                // document.querySelector(".songs").addEventListener("click", () => {
                //     playsong(ele);
                //     // searchbox.value=" ";
                // })

            })
            if (songdiv.childElementCount == 0) {
                songdiv.innerHTML = "No match found";
            }
      

    })

 
    vol.addEventListener("input", () => {
        song.volume = vol.value / 100;
    })

    document.querySelector("#backnav").addEventListener("click", () => {
        document.querySelector(".left").style.display = "none";
    })




    // window.addEventListener('resize', () => {
    //     if (window.innerWidth > 1400) {
    //         document.querySelector(".left").style.display = "flex";
    //     } else {
    //         document.querySelector(".left").style.display = "none"
    //     }
    // });
}

main();
