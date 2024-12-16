import { motion } from "framer-motion"
import { cn } from "../../utils"
import { createContext, useContext, useRef, useState } from "react"

const MouseEnterContext = createContext({
  mouseEnter: false,
  setMouseEnter: () => {},
})

export const CardContainer = ({
  children,
  className,
  containerClassName,
}) => {
  const containerRef = useRef(null)
  const [mouseEnter, setMouseEnter] = useState(false)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / 200
    const y = (e.clientY - top - height / 2) / 200
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`
  }

  const handleMouseEnter = () => {
    setMouseEnter(true)
  }

  const handleMouseLeave = () => {
    setMouseEnter(false)
    if (!containerRef.current) return
    containerRef.current.style.transition = 'transform 0.5s ease-out'
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.transition = ''
      }
    }, 500)
  }

  return (
    <MouseEnterContext.Provider value={{ mouseEnter, setMouseEnter }}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{
          perspective: "1000px",
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  )
}

export const CardBody = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  )
}

export const CardItem = ({
  as: Component = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const { mouseEnter } = useContext(MouseEnterContext)
  const transform = useRef(null)

  if (transform.current === null) {
    transform.current = {
      translateX,
      translateY,
      translateZ,
      rotateX,
      rotateY,
      rotateZ,
    }
  }

  const style = {
    transform: mouseEnter
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
    transition: "transform 200ms ease",
  }

  return (
    <Component className={cn("", className)} style={style} {...rest}>
      {children}
    </Component>
  )
}
