#!/usr/bin/env python3

import numpy as np
import cv2
import rospy
import tf2_ros
from sensor_msgs.msg import Image
import ros_numpy
import yaml
from smabo import tflib

imageLeft={
  "topic":"/camera/image",
  "file":"image_left.png"
}
imageRight={
  "topic":"/camera2/image",
  "file":"image_right.png"
}
pose={
  "from":"camera",
  "to":"camera_wd",
  "file":"pose.yaml"
}

done=0
def cb_left(msg):
  global done
  if done & 1: return
  try:
    im = ros_numpy.numpify(msg)
  except CvBridgeError as e:
    print("error in cv_bridge",e)
  else:
    cv2.imwrite(imageLeft["file"],im)
    done=done | 1

def cb_right(msg):
  global done
  if done & 2: return
  try:
    im = ros_numpy.numpify(msg)
  except CvBridgeError as e:
    print("error in cv_bridge",e)
  else:
    cv2.imwrite(imageRight["file"],im)
    done=done | 2

def cb_pose():
  global done
  if done & 4: return
  try:
    ts=tfBuffer.lookup_transform(pose["from"],pose["to"],rospy.Time())
  except (tf2_ros.LookupException, tf2_ros.ConnectivityException, tf2_ros.ExtrapolationException):
    pass
  else:
    ts.transform
    f=open(pose["file"],"w")
    f.write(yaml.dump(tflib.tf2dict(ts.transform)))
    f.close()
    done=done | 4

########################################################
rospy.init_node("image_saver",anonymous=True)
###Input topics
rospy.Subscriber(imageLeft["topic"],Image,cb_left)
rospy.Subscriber(imageRight["topic"],Image,cb_right)
tfBuffer=tf2_ros.Buffer()
listener=tf2_ros.TransformListener(tfBuffer)

while not rospy.is_shutdown():
  cb_pose()
  print("done",done)
  if done>=7: break
  rospy.sleep(0.1)
