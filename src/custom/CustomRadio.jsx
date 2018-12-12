import React from "react";
import { Radio } from "@material-ui/core";
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

function CustomRadio(props) {
  return (
    <Radio
        color="primary"
        icon={<RadioButtonUncheckedIcon fontSize="small" />}
        checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
        {...props}
    />
  );
}

export default CustomRadio;
