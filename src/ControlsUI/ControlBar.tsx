import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    IconLookup,
    IconDefinition,
    findIconDefinition
} from '@fortawesome/fontawesome-svg-core'

import React, { useEffect, useState } from 'react'
import { IPCService } from '../services/ipc.service'
import './ControlBar.css'


import { faArrowLeft, faXmark, faTable, faWindowMaximize } from '@fortawesome/free-solid-svg-icons'
import { Tabs, Tab, IconButton, Icon, styled, TabProps, Stack, ButtonGroup, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { APP_MODE } from '../models/AppState'

export const ControlBar = () => {
    const [value, setValue] = useState(0);

    const [tabs, setTabs] = useState<Array<{ label: string, tabId: string }>>([])
    const [mode, setMode] = useState(APP_MODE.STANDARD);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
        console.log("Changing tab to: ", newValue)
        IPCService.send('control', {
            action: 'switch-tab',
            tabId: tabs[newValue].tabId
        })
    };

    useEffect(() => {
        IPCService.listen('control', (event: any, cmd: any) => {
            console.log("Received event from control: ", event, cmd)
            if (cmd) {
                switch (cmd.action) {
                    case 'update-tabs':
                        console.log('Updating tabs', cmd)
                        const newTabs = cmd.tabs as Array<{ label: string, tabId: string }>;

                        setTabs(newTabs)

                        if (cmd.mode) {
                            setMode(cmd.mode as APP_MODE)
                        }

                        const activeIndex = newTabs.findIndex(t => t.tabId === cmd.activeTabId)
                        if (activeIndex >= 0) {
                            setValue(activeIndex)
                        }
                        break;
                }

            }
        })

        console.log("Requesting tab info")
        IPCService.send('control', {
            action: 'query-tabs'
        })
    }, [])

    return (
        <>
            <Stack direction={'row'} className='control-bar'>
                <IconButton onClick={() => {
                    IPCService.send('control', {
                        action: 'back'
                    })
                }}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </IconButton>
                {/* <IconButton onClick={()=> {
                    IPCService.send('control', {
                        action: 'open-tab',
                        tabId:'background-check',
                        label: 'background',
                        url: 'https://codepen.io/dSolver/full/qBpBrJx'
                    })
                }}>
                    <FontAwesomeIcon icon={faXmark} />
                </IconButton> */}
                {
                    tabs.length > 1 && (
                        <div>

                            <ToggleButtonGroup color="primary" exclusive={true} value={mode} onChange={(event, nextMode: APP_MODE) => {
                                if (nextMode !== mode) {
                                    setMode(nextMode)
                                    IPCService.send('control', {
                                        action: 'change-mode',
                                        mode: nextMode
                                    })
                                }
                            }}>
                                <ToggleButton value={APP_MODE.GRID}>
                                    <FontAwesomeIcon icon={faTable} />
                                </ToggleButton>
                                <ToggleButton value={APP_MODE.STANDARD}>
                                    <FontAwesomeIcon icon={faWindowMaximize} />
                                </ToggleButton>
                            </ToggleButtonGroup>

                        </div>

                    )
                }

                <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
                    {
                        tabs.map((tab, index) => {
                            return <StyledTab label={
                                <Stack direction="row" alignItems="center">
                                    {tab.label.substring(0, 25)}
                                    &nbsp;
                                    <CloseButton tabId={tab.tabId} />
                                </Stack>
                            } key={index} />
                        })
                    }
                </Tabs>
            </Stack>
        </>
    )
}

function CloseButton({ tabId }: { tabId: string }) {

    return <FontAwesomeIcon size={'lg'} aria-label="Close Tab" role="button" icon={faXmark} onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        IPCService.send('control', {
            action: 'close-tab',
            tabId
        })

    }} />
}

const StyledTab = styled((props: TabProps) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
    }),
);