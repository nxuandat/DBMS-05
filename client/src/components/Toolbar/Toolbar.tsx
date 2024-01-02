import React, { useState } from 'react';

interface ToolbarProps {
    onTimeFormatStateChange?: (checked: boolean) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onTimeFormatStateChange }) => {
    const [timeFormatState, setTimeFormatState] = useState(false);

    const handleTimeFormatStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeFormatState(e.target.checked);
        if (onTimeFormatStateChange) {
            onTimeFormatStateChange(e.target.checked);
        }
    }

    return (
        <div className='time-format-section'>
            <label className='time-format-chkbx'>
                Time format: 
                <input type='checkbox'
                    checked={ timeFormatState }
                    onChange={ handleTimeFormatStateChange }
                />
                <div className='chkbx-text'></div>
            </label>
        </div>
    );
}

export default Toolbar;
