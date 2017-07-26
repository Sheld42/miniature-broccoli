using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.Management;
using System.IO;

namespace HardwareID
{
    public class sidinezvezdi
    {
       

        public string getUniqueID(string drive)
        {
            if (drive == string.Empty)
            {
                //Find first drive 
                foreach (DriveInfo compDrive in DriveInfo.GetDrives())
                {
                    if (compDrive.IsReady)
                    {
                        drive = compDrive.RootDirectory.ToString();
                        break;
                    }
                }
            }

            if (drive.EndsWith(":\\"))
            {
                //C:\ -> C 
                drive = drive.Substring(0, drive.Length - 2);
            }

            string volumeSerial = getVolumeSerial(drive);
            string cpuID = getCPUID();

            //Mix them up and remove some useless 0's 
            //return cpuID.Substring(13) + cpuID.Substring(1, 4) + volumeSerial + cpuID.Substring(4, 4);
            return (cpuID.ToString() + "  " + volumeSerial.ToString()).ToString();
        }

        private string getVolumeSerial(string drive)
        {
            
            ManagementObject disk = new ManagementObject(@"win32_logicaldisk.deviceid=""" + drive + @":""");
            disk.Get();

            string volumeSerial = disk["VolumeSerialNumber"].ToString();
            disk.Dispose();

            return volumeSerial;
        }

        private string getCPUID()
        {
            string cpuInfo = "";
            ManagementClass managClass = new ManagementClass("win32_processor");
            ManagementObjectCollection managCollec = managClass.GetInstances();

            foreach (ManagementObject managObj in managCollec)
            {
                if (cpuInfo == "")
                {
                    //Get only the first CPU's ID 
                    cpuInfo = managObj.Properties["Revision"].Value.ToString();
                    break;
                }
            }

            return cpuInfo;
        }

        public void comp()
        {


            SelectQuery query = new SelectQuery(@"Select * from Win32_ComputerSystem");

            //initialize the searcher with the query it is supposed to execute
            using (ManagementObjectSearcher searcher = new ManagementObjectSearcher(query))
            {
                //execute the query
                foreach (ManagementObject process in searcher.Get())
                {
                    //print system info
                    process.Get();
                    MessageBox.Show("/*********Computer System Information ***************/");
                    MessageBox.Show(process["Caption"].ToString());
                    MessageBox.Show(process["Description"].ToString());
                    MessageBox.Show(process["Manufacturer"].ToString());
                    MessageBox.Show(process["Model"].ToString());
                    MessageBox.Show(process["TotalPhysicalMemory"].ToString());
                    
                }
            }

        }

    }
}