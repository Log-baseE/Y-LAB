import React from "react";
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

function IntegerInput(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            allowNegative={false}
        />
    );
}

IntegerInput.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default IntegerInput;