# EquipmentWorkshopManagement

> This is a program based on wechat applet for management of equipment workshop. Based on this program, you can easily manage the process of using kinds of euipements in the workshop. Besides, this program gives an example to connect wechat applet codes with hardware like Arduino and other sensiors. Anyone interested can use this program to finish a IOT program, since it has provided a mature structure.

## Introduction

For using this program, you need to get your own [wechat applet ID](https://mp.weixin.qq.com/cgi-bin/wx) first, and load those codes through [wechat developer tool](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html).  

After that, please check all pages including `.js` and `.config` documents, you need input your own information about **wechat applet ID**. Besides, please enter your **Cloud Develop** on the upper left corner of wechat developer tool, create database as follow:  

- **equipment database**
  | data name | types | data types | usage | explanation |
  | --------- | ----- | ---------- | ----- | ----------- |
  | name | equipment | `String` | equipment name | need to indicate the number of equipment (number of 3D printers) |
  | equipment_class | equipment | `String` | docking labor insurance reminder | It is used to distinguish the type of equipment, such as 3D printer and engraving machine. Just one big category. Many sub-devices can be placed in this class, such as the number and number of printers |
  
  



