function DigitalBackground(){

const binaries = new Array(40).fill(0)

return(

<div className="digital-bg">

{binaries.map((_,i)=>(
<span
key={i}
className="binary"
style={{
left:Math.random()*100+"%",
animationDuration:8+Math.random()*10+"s",
fontSize:12+Math.random()*12+"px"
}}
>
{Math.random()>0.5 ? "1" : "0"}
</span>
))}

</div>

)

}

export default DigitalBackground