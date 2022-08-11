import {useRef, useState} from 'react'
import "./list.scss"
import { ArrowBackIosOutlined,ArrowForwardIosOutlined } from '@material-ui/icons';
import ListItem from '../listitem/ListItem';
import {Link} from "react-router-dom"

const List = ({list}) => {

  const [slideNumber, setSlideNumber] = useState(0);
  const [isMoved, setIsMoved] = useState(false);

  const listRef = useRef();
  
  const handleClick =(direction)=>{
     setIsMoved(true);
     let distance= listRef.current.getBoundingClientRect().x -50
     if (direction === 'left' && slideNumber > 0)
     {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform =  `translateX(${230+distance}px)`;
     }
     if (direction === 'right' && slideNumber < 10)
     {
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform =  `translateX(${-230+distance}px)`;
     }


  } 

  return (
    <div className="list">
        <Link to={list.type=="movies" ? "/catalog/movies" : "/catalog/series" }>
        <span className="listTitle">{list.title}</span>
        </Link>
        <div className="wrapper">
             <ArrowBackIosOutlined className="sliderArrow left" onClick={()=>handleClick('left')} style={{display : !isMoved && "none"}} />
             <div className="contaner" ref={listRef}  >
              {list.content.map((item,i)=>
              (
                <ListItem index={i} item={item} key={i} />
              ))
              }
             </div>
             <ArrowForwardIosOutlined className="sliderArrow right" onClick={()=>handleClick('right')} />
         </div>
    </div>
    
  )
}

export default List