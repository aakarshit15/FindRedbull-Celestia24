import { useEffect, useState } from 'react';
import './App.css';
import img1 from "./assets/img1.jpg";
import redBull from "./assets/redBull.jpg"

function App() {

  const [cursorPosition, setCursorPostion] = useState({ x: -100, y: -100 });
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [clicked, setClicked] = useState([]);
  const [clickableAreas, setClickableAreas] = useState([]);
  const [mode, setMode] = useState(0);
  const [timerText, setTimerText] = useState("text-white");

  const handleMouseMove = (e) => {
    setCursorPostion({ x: e.clientX, y: e.clientY });
  }

  const generateRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  const calculateDistance = (area1, area2) => {
    const x1 = parseFloat(area1.left);
    const y1 = parseFloat(area1.top);
    const x2 = parseFloat(area2.left);
    const y2 = parseFloat(area2.top);

    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  const isPositionValid = (newArea, existingAreas, minDistance) => {
    for (let area of existingAreas) {
      if (calculateDistance(newArea, area) < minDistance) {
        return false;
      }
    }
    return true;
  }

  const generateClickableAreas = () => {
    const areas = [];
    const minDistance = 30;

    for (let i = 1; i <= 3; i++) {
      let newArea;
      let validPosition = false;

      while (!validPosition) {
        const top = generateRandom(10, 90) + "%";
        const left = generateRandom(10, 90) + "%";
        
        newArea = { id: i, top, left, width: `80px`, height: `80px` };
        
        if (isPositionValid(newArea, areas, minDistance)) {
          validPosition = true;
        }
      }

      areas.push(newArea);
    }
    return areas;
  }

  const handleImageClick = (id) => {
    if (score < 3 && !clicked.includes(id)) {
      setScore(score + 1);
      setClicked([...clicked, id]);
    }
  }

  useEffect(() => {
    if (timer > 0 && score < 3 && mode === 1) {
      const timeout = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [timer, score, mode]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
    };

    const handleKeydown = (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    setClickableAreas(generateClickableAreas());
  }, []); 

  useEffect(() => {
    if(timer === 0) {
      setTimerText("bg-slate-300 p-1 rounded-lg");
    }
  }, [timer]);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden bg-opacity-100" onMouseMove={handleMouseMove}>
        <div className={`pointer-events-none absolute w-[2.8rem] h-[2.8rem] rounded-full ${(score < 3 && timer > 0) && "shadow-[0_0_0_9999px_rgba(0,0,0,1)]"} ${mode === 0 ? "bg-black" : "bg-transparent"} z-20`} style={{ top: cursorPosition.y - 25, left: cursorPosition.x - 25, }} />
        <img src={img1} alt="background" className="absolute w-full h-full z-0" />

        {
          clickableAreas.map((area) => (
            <div key={area.id} id={area.id} className={`absolute transition-opacity duration-300 ${clicked.includes(area.id) ? "z-30" : "z-10"}`}
              style={{ top: area.top, left: area.left, width: area.width, height: area.height }} onClick={() => { handleImageClick(area.id) }}>
              <img src={redBull} className="absolute duration-300 w-7 h-auto transition-opacity" />
            </div>
          ))
        }

        <div className={`timer absolute z-30 text-3xl font-bold top-5 left-5 ${timerText}`}>
          Time Left: {`${mode === 0 ? "30" : timer}`}s
        </div>

        <button className={`start-btn absolute z-30 text-3xl font-bold top-5 left-[50%] text-white border-solid border-white border-[2px] p-2 rounded-3xl min-w-32 ${mode === 1 && "hidden"}`} onClick={() => {setMode(1)}}>
          Start
        </button>

        <div className={`score absolute z-30 text-3xl font-bold top-5 right-5 ${timerText}`}>
          Score: {score}
        </div>
      </div>
    </>
  );
}

export default App;
