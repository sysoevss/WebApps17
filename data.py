# coding=UTF-8
'''
Created on 24.09.2017

@author: sysoev
'''
from google.appengine.ext import db
from google.appengine.api import users

import datetime
import time
import logging


def force_unicode(string):
    if type(string) == unicode:
        return string
    return string.decode('utf-8')

class Project(db.Model):
    name = db.StringProperty(multiline=False)
    
def getProjectsList(user):
    return None

def updateProject(key, name):
    p = Project.get(key)
    if not p:
        return
    p.name = name
    p.put()

def addProject(name):
    p = Project()
    p.name = name
    p.put()
    return p.key()
    