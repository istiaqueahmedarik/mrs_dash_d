import { Box, Modal } from '@mui/material';
import React, { useState } from 'react';

const GridOption = ({grid,setGrid}) => {
  let val = ['Carbohydrate (Reducing Sugars)','Carbohydrate (polysaccharide)','Protein','Ammonia (NH4)']
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '55%' ,
    bgcolor: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '70px',
  }
  const [open, setOpen] = React.useState(false)
  const [decisions, setDecisions] = useState([0,0,0,0])
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleClick = (rowIndex, colIndex) => {
    console.log(`Row: ${rowIndex + 1}, Column: ${colIndex + 1}`);
    const newGrid = grid.map((row, r) => row.map((col, c) => {
      if (r === rowIndex && c === colIndex) {
        return !col;
      }
      return col;
    }));
    setGrid(newGrid);
  };
  const getDecision = (row) => {
    const count = row.filter(Boolean).length;
    if (count === 4) return 'Extant';
    if (count === 3) return 'Extant';
    if (count === 2 && row[2] && row[3]) return 'Extinct with the increasing possibility of being extants';
    if (count === 2) return 'Extant';
    if (count === 1 && row[3]) return 'Existance of life cannot be determined with assurance';
    if (count === 1) return 'Extant';
    return 'No Presence Of Life';
  };
  
  const printGrid = () => {
    setOpen(true)
    let decisions = []
    grid.forEach((row, rowIndex) => {
      const rowLabels = row.map((col, colIndex) => col ? val[colIndex] : '✖');
      const decision = getDecision(row);
      console.log(`${rowLabels.join('\t')}\t${decision}`);
      decisions.push(decision)
    });
    setDecisions(decisions)
    return decisions
  }

  return (
    <div>
    <div style={{ display: 'grid',gridTemplateColumns:'0fr 1fr 1fr 1fr 1fr' }}>
      <div style={{ width: '100px' }} /> 
      {grid[0].map((_, colIndex) => (
        <div key={colIndex} className='text-xs text-wrap break-words' style={{ width: '80px',margin:'auto'}}>
          {val[colIndex]}
        </div>
      ))}
    </div>
  
    {grid.map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex' }}>
        <div style={{ width: '100px',margin:'auto',marginLeft:'0',marginRight:'0', textAlign: 'center' }}>
         Sample {rowIndex + 1}
        </div>
  
        {row.map((col, colIndex) => (
          <div
            key={colIndex}
            onClick={() => handleClick(rowIndex, colIndex)}
            style={{
              width: '128px',
              height: '128px',
              backgroundColor: col ? 'green' : 'gray',
              border: '1px solid black',
              cursor: 'pointer',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '5px',
            }}
          >
          </div>
        ))}


      </div>
    ))}
    <div className='flex flex-row m-auto justify-center'>
    <button className='m-5 bg-green-500 hover:bg-white hover:text-black pl-3 pr-3 pt-2 pb-2 rounded-full transition-all' onClick={printGrid}>Submit</button>

<button className='m-5 pl-3 pr-3 pt-2 pb-2 rounded-full bg-red-500 hover:bg-white hover:text-black transition-all' onClick={() => setGrid(Array(3).fill(Array(4).fill(false)))}>Reset</button>
    </div>
    

    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='overflow-y-scroll'
      >
        <Box sx={style}>
          <h1 className='text-center'>Results</h1>
          <div className='grid grid-cols-1 '>
          {decisions.map((decision, index) => (
            <div key={index} className='m-5 p-5 bg-slate-500 rounded-full text-white text-center'>{"Sample "+(index+1)+" ->"}{decision}</div>
          ))}
          </div>
        </Box>
      </Modal>

  </div>
  );
};

export default GridOption;