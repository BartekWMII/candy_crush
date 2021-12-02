import { useEffect, useState } from "react"

const width = 8
const candyColors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow']


const App = () => {

  const [currentColorArg, setCurrentColorArg] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)


  const checkForColumnFour = () => {

    for(let i=0; i<= 39; i++)
    {
      const columnOfFour = [i, i+width, i+width * 2, i + width * 3]
      const decidedColor = currentColorArg[i]

      if(columnOfFour.every(square => currentColorArg[square]=== decidedColor)){
          columnOfFour.forEach(square => currentColorArg[square] = '')
          return true
      }
    }
  }


  const checkForColumnThree = () => {

    for(let i=0; i<= 47; i++)
    {
      const columnOfThree = [i, i+width, i+width * 2]
      const decidedColor = currentColorArg[i]

      if(columnOfThree.every(square => currentColorArg[square]=== decidedColor)){
          columnOfThree.forEach(square => currentColorArg[square] = '')
          return true
      }
    }
  }



  const checkForRowFour = () => {

    for(let i=0; i< 64; i++)
    {
      const rowOfFour = [i, i+1, i+2, i+3]
      const decidedColor = currentColorArg[i]
      const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64]

      if(notValid.includes(i))continue

      if(rowOfFour.every(square => currentColorArg[square]=== decidedColor)){
          rowOfFour.forEach(square => currentColorArg[square] = '')
          return true
      }
    }
  }

  const checkForRowThree = () => {

    for(let i=0; i< 64; i++)
    {
      const rowOfThree = [i, i+1, i+2]
      const decidedColor = currentColorArg[i]
      const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]

      if(notValid.includes(i))continue

      if(rowOfThree.every(square => currentColorArg[square]=== decidedColor)){
          rowOfThree.forEach(square => currentColorArg[square] = '')
          return true
      }
    }
  }



  const moveIntoSquareBelow = () =>{

    for(let i=0; i<=55; i++)
    {
      const firstRow = [0,1,2,3,4,5,6,7]
      const isFirstRow= firstRow.includes(i)

      if(isFirstRow && currentColorArg[i] === '')
      {
        let randomColor = Math.floor(Math.random()*candyColors.length)
        currentColorArg[i]= candyColors[randomColor]
      }

      if((currentColorArg[i + width]) === '')
      {
        currentColorArg[i+width] = currentColorArg[i]
        currentColorArg[i]= ''
      }
    }

  }


  const dragStart =(e) =>{
    console.log(e.target)
    console.log('drag start')
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    console.log('Drag drop')
    setSquareBeingReplaced(e.target)
  }  

  const dragEnd = (e) =>
  {
    console.log('drag end')
    const squareBeingDraggedID = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedID = parseInt(squareBeingReplaced.getAttribute('data-id'))

    currentColorArg[squareBeingDraggedID]=squareBeingReplaced.style.backgroundColor
    currentColorArg[squareBeingReplacedID]=squareBeingDragged.style.backgroundColor

    console.log('squarebeingDraggedID', squareBeingDraggedID)
    console.log('squarebegin replaced', squareBeingReplacedID)


    const validMoves = [
      squareBeingDraggedID -1,
      squareBeingDraggedID - width,
      squareBeingDraggedID +1,
      squareBeingDraggedID + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedID)

    const isAColumnOfFour = checkForColumnFour()
    const isARowOfFour = checkForRowFour()
    const isAColumnOfThree = checkForColumnThree()
    const isARowOfThree = checkForRowThree()

    if(squareBeingReplacedID && validMove && (isARowOfThree || isARowOfFour || isAColumnOfThree || isAColumnOfFour)){
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    }
    else
    {
      currentColorArg[squareBeingReplacedID] = squareBeingReplaced.style.backgroundColor
      currentColorArg[squareBeingDraggedID] = squareBeingDragged.style.backgroundColor
      setCurrentColorArg([...currentColorArg])

    }

  }

  


  const createBoard = () => {   //function expression

      const randomColorArg = []

      for(let i=0; i<width*width; i++)
      {
          const randomNumber = Math.floor(Math.random() * candyColors.length)
          const randomColor = candyColors[randomNumber]
          randomColorArg.push(randomColor)
      }
      setCurrentColorArg(randomColorArg)
  }

  useEffect(() => {
    createBoard()
  }, [])


  useEffect(() => {
    
    const timer = setInterval(() => {
        checkForColumnFour()
        checkForRowFour()
        checkForColumnThree()
        checkForRowThree()
        moveIntoSquareBelow()
        setCurrentColorArg([...currentColorArg])
    },100)
    return () => clearInterval(timer)

  }, [checkForColumnFour, checkForRowFour, checkForColumnThree, checkForRowThree, moveIntoSquareBelow, currentColorArg])

  //console.log(currentColorArg)


 // function createBoard () { //function


  return (
    <div className="app">
        <div className="game">
          {currentColorArg.map((candyColor, index) => (

            <img 
            key={index} 
            style={{backgroundColor: candyColor}} 
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            />
            
          ))}
        </div>
    </div>
  );
  }


export default App;
