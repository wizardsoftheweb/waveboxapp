import PropTypes from 'prop-types'
import React from 'react'
import { FormControl, InputLabel, Select } from '@material-ui/core'
import shallowCompare from 'react-addons-shallow-compare'
import { withStyles } from '@material-ui/core/styles'
import SettingsListItem from './SettingsListItem'
import SettingsListItemSelectOptionRenderer from './SettingsListItemSelectOptionRenderer'

const styles = {
  select: {
    fontSize: '0.8rem',
    marginTop: 20
  }
}

@withStyles(styles)
class SettingsListItemSelect extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    label: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
    options: PropTypes.array.isRequired,
    disabled: PropTypes.bool
  }

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { classes, disabled, className, label, onChange, value, options, ...passProps } = this.props

    return (
      <SettingsListItem {...passProps}>
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select
            MenuProps={{
              disableEnforceFocus: true,
              MenuListProps: { dense: true }
            }}
            margin='dense'
            className={classes.select}
            disabled={disabled}
            fullWidth
            value={value}
            renderValue={(value) => SettingsListItemSelectOptionRenderer.renderValue(options, value)}
            onChange={(evt) => { onChange(evt, evt.target.value) }}>
            {SettingsListItemSelectOptionRenderer.renderOptions(options)}
          </Select>
        </FormControl>
      </SettingsListItem>
    )
  }
}

export default SettingsListItemSelect
