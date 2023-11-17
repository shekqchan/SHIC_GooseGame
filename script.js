let degree = 0;
let score = 0;
let isRunning = false; // null

window.mobileCheck = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

window.addEventListener('DOMContentLoaded', resetGame);

// resetGame : 모든 객체를 초기화하고 사용자 입력을 대기
async function resetGame() {
    const isMobile = window.mobileCheck();
    const alertWrapper = document.getElementById('alertWrapper');
    const goose_head = document.getElementById('goose_head');
    const goose_feet = document.getElementsByClassName('goose_foot');
    const scoreEl = document.getElementById('gameScore');
    const alertEl = document.getElementById('gameAlert');
    
    degree = 0;  // 각도 초기화
    score = 0;   // 점수 초기화
    isRunning = false;
    goose_head.style.setProperty('--degree', degree + 'deg');  // 머리 원위치
    scoreEl.innerText = '0m';  // 표시 점수 초기화
    alertEl.innerText = isMobile ? 'TOUCH SCREEN TO START' : 'PRESS SPACE TO START';  // 메시지 초기화
    alertWrapper.className = "";  // in-game 태그 제거

    // 시작 입력 대기
    (new Promise((resolve, reject) => {
        if (isMobile) {  // 모바일이면 화면 클릭해서
            const clickAreaEl = document.getElementById("clickArea");
            const evt = clickAreaEl.addEventListener("click", (e) => {
                clickAreaEl.removeEventListener("click", evt); // 일회성 이벤트
                if (!isRunning) { resolve(); } 
            });
        } else {  // 데스크탑이면 게임키 입력해서
            const evt = document.addEventListener("keydown", (e) => { 
                if ([32, 37, 39].includes(e.keyCode) && !isRunning) { // <-, ->, space 눌리고 게임중X
                    document.removeEventListener("keydown", evt); // 일회성 이벤트
                    resolve();
                } 
            }); 
        }
    })).then(() => {  // 플레이어 상호작용 시작
        alertWrapper.className = "in-game";  // in-game : 상단 메시지 숨기기 위한 class
        startGame(goose_head, goose_feet, scoreEl).then(resetGame);
        // startGame은 Promise 반환(resolve는 게임오버시에만)
    })
}

// startGame : 사용자 입력(시작키)후 게임 시작
function startGame(goose_head, goose_feet, scoreEl) {
    isRunning = true;
    $('#bg')[0].style.animationPlayState = 'running';
    
    for (let footEl of goose_feet) { footEl.classList.remove('stop_walking'); }  // 거위 발 움직이기
    degree = 3 * (Math.random() < 0.5 ? -1 : 1) + 3 * (Math.random()-0.5) // +-((3 +- 1.5)deg)   // * (Math.random() < 0.5 ? -1 : 1);  // 5˚ 앞뒤 랜덤으로
    goose_head.style.setProperty('--degree', degree + 'deg');  // 머리 원위치
    return new Promise((resolve, reject) => {
        const evt = document.addEventListener("keydown", (e) => {
            if (e.keyCode == 37) { tiltGoose(-1); console.log("<-"); }        // <-
            else if (e.keyCode == 39) { tiltGoose(1); console.log("->"); }    // ->
        });
        
        const timer = setInterval(() => {
            //absDeg = Math.abs(degree)
            degree = Math.floor(degree * 1.2 * 100) / 100; //Math.min(degree*1.2, 20);// Math.floor((-(degree-10))**0.5 * 100) / 100 || 10; //(degree/absDeg) * 2 * Math.floor(absDeg**0.5 * 100) / 100;
            score += 0.03
            scoreEl.innerText = score.toFixed(2) + 'm'
            console.log(degree);
            if (degree < -90 || degree > 150) {
                clearInterval(timer);
                goose_head.style.setProperty('--degree', (degree > 150 ? 150 : -90) + 'deg');  // 최대각도 설정
                for (let footEl of goose_feet) { footEl.classList.add('stop_walking'); }  // 거위 발 멈추기
                document.removeEventListener("keydown", evt);
                // console.log(score);
                showGameOverAlert(resolve);
                return;
            }
            goose_head.style.setProperty('--degree', degree + 'deg');
        }, 100);
    })
}

// \frac{\left[\left(\left|k\right|^{0.2}+1\right)\ \cdot \ x^{0.5}\ \cdot \ 100\right]}{100}

function tiltGoose(direction) {
    console.log("click");
    degree += direction * Math.floor(15 * (Math.abs(degree)**0.2 + 1) * score**0.5 * 100) / 100
    // degree += direction * Math.floor(15 * (Math.abs(degree)**0.2 + 1) * score**0.5 * 100) / 100
    // degree += direction * Math.floor(15 * (Math.abs(degree)**0.5 + 1) * score**0.3 * 100) / 100
    // degree += direction * Math.floor(10 * (Math.abs(degree)**0.5 + 1) * score**0.8 * 100) / 100

    // degree += direction * 30;// Math.floor(15 * (Math.abs(degree)**0.2 + 1) * score**0.5 * 100) / 100
}

function showGameOverAlert(callback) {
    $('#game-score')[0].innerText = score.toFixed(2) + 'm';
    $('#wrapper-gameover')[0].style.display = '';
    $('#bg')[0].style.animationPlayState = 'paused';
    callback();
}

// closeGameOverAlert : 게임오버 알림창 닫기
const closeGameOverAlert = () => {
    console.log("closeGameOverAlert");
    $('#wrapper-gameover')[0].style.display = 'none';
    
}

// submitRankings: 랭킹 등록  
const submitRankings = () => {
    const username = $('#username').value;
    const score = $('#score').value;
    const data = { username, score };
    console.log(data);
    openRankings();
}

// openRankings : 랭킹창 열기
const openRankings = () => {
    console.log("openRankings");
    const elements = $('#wrapper-rankings');
};

// closeRankings : 랭킹창 닫기
const closeRankings = () => {
    $('#wrapper-rankings').style.display = 'none';
};
