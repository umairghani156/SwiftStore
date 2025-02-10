import { PaletteIcon } from 'lucide-react'
import React from 'react'
import { THEMES } from '../constants'
import { useDispatch, useSelector } from 'react-redux';

function ThemeSelector() {
    const theme = "forest";
    const dispatch = useDispatch();
    const {theme: themeState} = useSelector((state: any) => state.theme);
   console.log(themeState);

    const themeHandler = (themeType: string)=>{
        console.log("Hello", themeType);
        dispatch({type: "theme/setTheme", payload: themeType})
    }
  return (
    <div className='dropdown dropdown-end'>

        <button tabIndex={0} className='btn btn-ghost btn-circle'>
            <PaletteIcon className='size-5'/>

        </button>
        <div tabIndex={0} className='dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
         w-56 border border-base-content/10' >
            {
                THEMES.map(themeOption => <button key={themeOption.name}
                    onClick={()=>themeHandler(themeOption.name)}
                className={
                    `w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
                    ${themeState === themeOption.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}
                    `
                }>
                    <PaletteIcon className='size-4'/>
                    <span className='text-sm font-medium'>{themeOption.label}</span>

                    <div className='ml-auto flex gap-1'>
                        {
                            themeOption.colors.map((color,i) => <span key={i} className='size-2 rounded-full' style={{backgroundColor: color}}/> )
                        }

                    </div>
                </button>)
            }
        </div>
    </div>
  )
}

export default ThemeSelector