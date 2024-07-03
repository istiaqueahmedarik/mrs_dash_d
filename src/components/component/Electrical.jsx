'use client'
import React, { useState } from 'react'
import Cam from './Cam'
import { BarChart, LineChart } from '@mui/x-charts'
import GaugeChart from 'react-gauge-chart'
import { motion } from "framer-motion";
import { cn } from "../../utils/cn"
import { TracingBeam } from '../ui/tracing'
import { PinContainer } from '../ui/tdpin'
import { LampContainer } from '../ui/lamp'
import { Box, Typography } from '@mui/material'
function Electrical() {
    const [rock, setRock] = useState([])
    const [v,setV] = useState(36.67);
    setTimeout(()=>{
      setV((v-0.3).toFixed(2));
    },5000)
  return (
    <TracingBeam className="mb-5">
       <div className=''>
        <h1 className='text-4xl text-center'>Electrical Dashboard</h1>
        <div>
        <Cam type={'rock'} data={rock} setData={setRock}/>
        </div>
        <div>
            <div className='pl-5 pr-5 flex flex-row m-auto w-full '>
            {/* Current Voltage Value */}
            <div className='border border-[#d4fbb7] bg-[#141414] w-fit p-[5rem] rounded-xl hover:bg-[#232323] transition-all m-auto  relative items-center justify-center antialiased'>
                <p className='text-xl'>Current Voltage: </p>
                <h1 className='text-7xl'>{v}V</h1>
        <BackgroundBeams className={"voltage"}/>

            </div>
            {/* Battery Charge Graph of allTime */}
            <div className='flex flex-col justify-center'>
               <h1 className="text-center text-3xl">Battery Charge</h1>
           
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography variant="body1" sx={{ transform: 'rotate(-90deg)' }}>
      Charge(%)
    </Typography>
            <LineChart 
         
         series={[
             {
                 data: [100,98,97,95,94,92,90,88,85,80,75,70],
                 
                 label: 'Charge(%)',
                 area: true,
                 curve: "monotoneX",
             }
             
            
         ]
        
        }
        
        
         width={600}
         height={400}
         sx={{
             '& .MuiChartsAxis-tickLabel': {
               color: 'white',
               fill: 'white !important',
             },
             '& .MuiChartsAxis-line': {
               stroke: 'white !important',
             }, 
             '&': {
               stroke: 'white !important',
             },
           }}
         />
          </Box>
  <Typography variant="body1">
    Time
  </Typography>
</Box>
        
            </div>
            
            </div>
            <div className='m-auto grid place-content-center p-4'>
                {/* cell 1-9 voltage bar and maxV is 4.2V */}
                <h1 className='text-center text-4xl'>
                    Cell Voltage
                </h1>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography variant="body1" sx={{ transform: 'rotate(-90deg)' }}>
      Voltage(V)
    </Typography>
    <BarChart
  xAxis={[{ scaleType: 'band', data: ['Cell Voltages'] }]}
  
  series={[
    
    { data: [3], label: 'C1' },
    { data: [2.9], label: 'C2' },
    { data: [2.75], label: 'C3' },
    { data: [3.2], label: 'C4' },
    { data: [3.12], label: 'C5' },
    { data: [3.15], label: 'C6' },
    { data: [3], label: 'C7' },
    { data: [2.75], label: 'C8' },
    { data: [2.5], label: 'C9' },
  ]}

  width={1024}
  height={500}
  sx={{
    '& .MuiChartsAxis-tickLabel': {
      color: 'white',
      fill: 'white !important',
    },
    '& .MuiChartsAxis-line': {
      stroke: 'white !important',
    }, 
    '&': {
      stroke: 'white !important',
    },
  }}
/>
          </Box>
  
</Box>
               
            </div>
            <div className='pl-5 pr-5 flex flex-row m-auto w-full'>
                {/* Temperature Graph of last 100*/}
                <div className='flex flex-col'>
                  <h1 className="text-center text-3xl">Battery Temperature</h1>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography variant="body1" sx={{ transform: 'rotate(-90deg)' }}>
      Temperature(°C)
    </Typography>
    <LineChart 
         
         series={[
             {
                 data: [25,28,30,26,35,28,20,25],
                 label: 'Temperature(°C)',
                 area: true,
                 curve: "natural",
             }
             
            
         ]}
         width={700}
         height={400}
         sx={{
             '& .MuiChartsAxis-tickLabel': {
               color: 'white',
               fill: 'white !important',
             }, 
             '& .MuiChartsAxis-line': {
               stroke: 'white !important',
             }, 
             '&': {
               stroke: 'white !important',
             },
           }}
         />
          </Box>
  <Typography variant="body1">
    Time
  </Typography>
</Box>
          
         
            </div>


                {/* Current Flow Graph if over exceed warning and V rise I low */}
                <div className='flex flex-col m-auto justify-center'>
                <PinContainer
        title="Current Flow is: 3.4A"
      >

<GaugeChart id="gauge-chart5"
  nrOfLevels={420}
  arcsLength={[0.3, 0.5, 0.2]}
  colors={['#5BE12C', '#F5CD19', '#EA4228']}
  percent={0.87}
  arcPadding={0.02}
/>
<h1 className='text-center text-2xl'>Current Flow Percentage</h1>

      </PinContainer>
                
                </div>
            </div>
        </div>
        </div>
    </TracingBeam>
        
  )
}

export default Electrical

// 4.2-3.5v



const BackgroundBeams = ({ className }) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
    "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
    "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
    "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
    "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
    "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
    "M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787",
    "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
    "M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771",
    "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
    "M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755",
    "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
    "M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739",
    "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
    "M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723",
    "M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715",
    "M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707",
    "M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699",
    "M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691",
    "M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683",
    "M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675",
    "M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667",
    "M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659",
    "M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651",
    "M-177 -421C-177 -421 -109 -16 355 111C819 238 887 643 887 643",
    "M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635",
    "M-163 -437C-163 -437 -95 -32 369 95C833 222 901 627 901 627",
    "M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619",
    "M-149 -453C-149 -453 -81 -48 383 79C847 206 915 611 915 611",
    "M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603",
    "M-135 -469C-135 -469 -67 -64 397 63C861 190 929 595 929 595",
    "M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587",
    "M-121 -485C-121 -485 -53 -80 411 47C875 174 943 579 943 579",
    "M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571",
    "M-107 -501C-107 -501 -39 -96 425 31C889 158 957 563 957 563",
    "M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555",
    "M-93 -517C-93 -517 -25 -112 439 15C903 142 971 547 971 547",
    "M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539",
    "M-79 -533C-79 -533 -11 -128 453 -1C917 126 985 531 985 531",
    "M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523",
    "M-65 -549C-65 -549 3 -144 467 -17C931 110 999 515 999 515",
    "M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507",
    "M-51 -565C-51 -565 17 -160 481 -33C945 94 1013 499 1013 499",
    "M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491",
    "M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483",
  ];
  return (
    <div
      className={cn(
        "absolute  h-full w-full overflow-hidden inset-0  [mask-size:20px] [mask-repeat:no-repeat] flex items-center justify-center",
        className
      )}
    >
      <svg
        className=" z-0 h-full w-fit pointer-events-none absolute "
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651M-177 -421C-177 -421 -109 -16 355 111C819 238 887 643 887 643M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635M-163 -437C-163 -437 -95 -32 369 95C833 222 901 627 901 627M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619M-149 -453C-149 -453 -81 -48 383 79C847 206 915 611 915 611M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603M-135 -469C-135 -469 -67 -64 397 63C861 190 929 595 929 595M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587M-121 -485C-121 -485 -53 -80 411 47C875 174 943 579 943 579M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571M-107 -501C-107 -501 -39 -96 425 31C889 158 957 563 957 563M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555M-93 -517C-93 -517 -25 -112 439 15C903 142 971 547 971 547M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539M-79 -533C-79 -533 -11 -128 453 -1C917 126 985 531 985 531M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523M-65 -549C-65 -549 3 -144 467 -17C931 110 999 515 999 515M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507M-51 -565C-51 -565 17 -160 481 -33C945 94 1013 499 1013 499M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483M-30 -589C-30 -589 38 -184 502 -57C966 70 1034 475 1034 475M-23 -597C-23 -597 45 -192 509 -65C973 62 1041 467 1041 467M-16 -605C-16 -605 52 -200 516 -73C980 54 1048 459 1048 459M-9 -613C-9 -613 59 -208 523 -81C987 46 1055 451 1055 451M-2 -621C-2 -621 66 -216 530 -89C994 38 1062 443 1062 443M5 -629C5 -629 73 -224 537 -97C1001 30 1069 435 1069 435M12 -637C12 -637 80 -232 544 -105C1008 22 1076 427 1076 427M19 -645C19 -645 87 -240 551 -113C1015 14 1083 419 1083 419"
          stroke="url(#paint0_radial_242_278)"
          strokeOpacity="0.05"
          strokeWidth="0.5"
        ></path>
 
        {paths.map((path, index) => (
          <motion.path
            key={index}
            d={path}
            stroke={`url(#linearGradient-${index})`}
            strokeOpacity="0.4"
            strokeWidth="0.5"
          ></motion.path>
        ))}
        <defs>
          {paths.map((path, index) => (
            <motion.linearGradient
              id={`linearGradient-${index}`}
              x1="100%"
              x2="100%"
              y1="100%"
              y2="100%"
              key={`gradient-${index}`}
              animate={{
                x1: ["0%", "100%"],
                x2: ["0%", "95%"],
                y1: ["0%", "100%"],
                y2: ["0%", `${93 + Math.random() * 8}%`],
              }}
              transition={{
                duration: Math.random() * 2 + 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 0,
              }}
            >
              <stop stopColor="#18CCFC" stopOpacity="0"></stop>
              <stop stopColor="#18CCFC"></stop>
              <stop offset="32.5%" stopColor="#6344F5"></stop>
              <stop offset="100%" stopColor="#AE48FF" stopOpacity="0"></stop>
            </motion.linearGradient>
          ))}
 
          <radialGradient
            id="paint0_radial_242_278"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
          >
            <stop offset="0.0666667" stopColor="var(--neutral-300)"></stop>
            <stop offset="0.243243" stopColor="var(--neutral-300)"></stop>
            <stop offset="0.43594" stopColor="white" stopOpacity="0"></stop>
          </radialGradient>
           
        </defs>
      </svg>
    </div>
  );
};