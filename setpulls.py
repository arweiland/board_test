#!/usr/bin/python

'''
This program uses the pigpiod daemon to set the pull-up resistors
on the volume up / down switches for the board test program.

The onoff library used for the test program doesn't allow control
of the pull-ups.

This program needs to be run before the test program
'''

vol_up = 26                # GPIO of volume up switch
vol_dn = 18                # GPIO of volume down switch

import pigpio

pi = pigpio.pi()           # Access localhost pigpiod

pi.set_mode( vol_up, pigpio.INPUT )            # volume up switch
pi.set_pull_up_down( vol_up, pigpio.PUD_UP )   # set pull up
pi.set_mode( vol_dn, pigpio.INPUT )            # volume down switch
pi.set_pull_up_down( vol_dn, pigpio.PUD_UP )   # set pull up

pi.stop()                  # Free resources

print "pull-up resistors enabled"
