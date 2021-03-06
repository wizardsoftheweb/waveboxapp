import React from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import { notifhistStore } from 'stores/notifhist'
import { mailboxActions } from 'stores/mailbox'
import { emblinkActions } from 'stores/emblink'
import Infinate from 'react-infinite'
import { List } from '@material-ui/core'
import { ipcRenderer } from 'electron'
import { WB_FOCUS_MAILBOXES_WINDOW } from 'shared/ipcEvents'
import NotificationListItem from './NotificationListItem'

const MAIN_REF = 'MAIN'
const INFINATE_REF = 'INFINATE'
const LIST_ITEM_HEIGHT = 67

const styles = { // Use styles here so some pass-through functions work
  main: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  list: {
    padding: 0
  },
  listItem: {
    height: LIST_ITEM_HEIGHT
  }
}

export default class NotificationScene extends React.Component {
  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    notifhistStore.listen(this.notificationsChanged)

    window.addEventListener('resize', this.saveContainerHeight, false)
    this.saveContainerHeight()
  }

  componentWillUnmount () {
    notifhistStore.unlisten(this.notificationsChanged)

    window.removeEventListener('resize', this.saveContainerHeight)
  }

  componentDidUpdate () {
    this.saveContainerHeight()
  }

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  state = (() => {
    return {
      notifications: notifhistStore.getState().notifications,
      containerHeight: 0
    }
  })()

  notificationsChanged = (notificationState) => {
    this.setState({
      notifications: notificationState.notifications
    })
  }

  /* **************************************************************************/
  // UI Lifecycle
  /* **************************************************************************/

  saveContainerHeight = () => {
    const height = this.refs[MAIN_REF].clientHeight
    if (height !== this.state.containerHeight) { // Don't queue in a callback, this is good enough
      this.setState({ containerHeight: height })
    }
  }

  /* **************************************************************************/
  // Public
  /* **************************************************************************/

  /**
  * Resets the navigation stack
  */
  resetNavigationStack = () => {
    ReactDOM.findDOMNode(this.refs[INFINATE_REF]).scrollTop = 0
  }

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Handles the notification being clicked on
  * @param evt: the event that fired
  * @param notification: the notification object
  */
  handleNotificationClick = (evt, notification) => {
    ipcRenderer.send(WB_FOCUS_MAILBOXES_WINDOW, {})
    mailboxActions.changeActive(notification.mailboxId, notification.serviceType)
    if (notification.openPayload) {
      // Not all notifications are openable at any time
      emblinkActions.openItem(notification.mailboxId, notification.serviceType, notification.openPayload)
    }
  }

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { style, ...passProps } = this.props
    const { notifications, containerHeight } = this.state

    return (
      <div ref={MAIN_REF} style={{...styles.main, ...styles}} {...passProps}>
        <List style={styles.list}>
          {containerHeight === 0 ? undefined : (
            <Infinate ref={INFINATE_REF} containerHeight={containerHeight} elementHeight={LIST_ITEM_HEIGHT}>
              {notifications.map(({id, timestamp, notification}) => {
                return (
                  <NotificationListItem
                    key={id}
                    style={styles.listItem}
                    mailboxId={notification.mailboxId}
                    notification={notification}
                    timestamp={timestamp} />
                )
              })}
            </Infinate>
          )}
        </List>
      </div>
    )
  }
}
