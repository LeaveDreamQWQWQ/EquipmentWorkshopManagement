# EquipmentWorkshopManagement

> This is a program based on wechat applet for management of equipment workshop. Based on this program, you can easily manage the process of using kinds of euipements in the workshop. Besides, this program gives an example to connect wechat applet codes with hardware like Arduino and other sensiors. Anyone interested can use this program to finish a IOT program, since it has provided a mature structure.

## Introduction

For using this program, you need to get your own [wechat applet ID](https://mp.weixin.qq.com/cgi-bin/wx) first, and load those codes through [wechat developer tool](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html).  

After that, please check all pages including `.js` and `.config` documents, you need input your own information about **wechat applet ID**. Besides, please enter your **Cloud Develop** on the upper left corner of wechat developer tool, create database as follow:  

- **equipment database**
  | data name | types | data types | usage | explanation |
  | --------- | ----- | ---------- | ----- | ----------- |
  | name | equipment | `String` | Equipment name | need to indicate the number of equipment (number of 3D printers) |
  | equipment_class | equipment | `String` | Docking labor insurance reminder | It is used to distinguish the type of equipment, such as 3D printer and engraving machine. Just one big category. Many sub-devices can be placed in this class, such as the number and number of printers |
  | state | equipment | `String` | Used to verify the status of the device | 1 is idle, 2 is not idle, 3 is fault |
  | icon | equipment | `String` | It's usually a link to a website. For example, the printer icon link is [link](https://cdn0.iconfinder.com/data/icons/3d-printing-solid-1/48/3d_printer_printing-512.png) |
  | totalTime | equipment | `String` | The data type can be modified according to actual needs. If the number type is better, please modify the data type and delete the current parentheses. | Total duration of the storage device. After the user finishes using the storage device, the existing total duration is read, and the new total duration is entered. Note: Here is the actual time after completion (end minus beginning), not the appointment time, so as to reduce the error between the appointment and the actual time. |
  
  



