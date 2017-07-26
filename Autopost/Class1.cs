using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.Management;
using System.IO;
using System.Linq;
using System.Security.Cryptography;

namespace HardwareID
{

    public class DigitalSignature
    {
        private RSAParameters _publicKey;
        public void AssignPublicKey()
        {
            try
            {
                _publicKey.Exponent = File.ReadAllBytes("exp.bin");
                _publicKey.Modulus = File.ReadAllBytes("Modulus.bin");
            }
            catch { MessageBox.Show("Файлы ключей повреждены либо отсутствуют.","Ошибка",MessageBoxButtons.OK,MessageBoxIcon.Error); }
        }
        
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
            return cpuID + volumeSerial;
        }

        public string getVolumeSerial(string drive)
        {
            ManagementObject disk = new ManagementObject(@"win32_logicaldisk.deviceid=""" + drive + @":""");
            disk.Get();

            string volumeSerial = disk["VolumeSerialNumber"].ToString();
            disk.Dispose();

            return volumeSerial;
        }

        public string getCPUID()
        {
            string cpuInfo = "";
            ManagementClass managClass = new ManagementClass("win32_processor");
            ManagementObjectCollection managCollec = managClass.GetInstances();

            foreach (ManagementObject managObj in managCollec)
            {
                if (cpuInfo == "")
                {
                    //Get only the first CPU's ID 
                    cpuInfo = managObj.Properties["processorID"].Value.ToString();
                    break;
                }
            }

            return cpuInfo;
        }

        public string RetrieveComputerProps()
        {
            //initialize the select query with command text
            SelectQuery query = new SelectQuery(@"Select * from Win32_ComputerSystem");

            //initialize the searcher with the query it is supposed to execute
            using (ManagementObjectSearcher searcher = new ManagementObjectSearcher(query))
            {
                //execute the query
                string str = "";
                foreach (ManagementObject process in searcher.Get())
                {
                    //print system info
                    process.Get();
                    str = str + process["Caption"].ToString() + process["Description"].ToString() + process["Manufacturer"].ToString() + process["Model"].ToString() + process["TotalPhysicalMemory"].ToString();
                }
                return str;
            }
        }


        public bool VerifySignature(byte[] hashOfDataToSign, byte[] signature)
        {
            try
            {
                using (var rsa = new RSACryptoServiceProvider(2048))
                {
                    rsa.ImportParameters(_publicKey);
                    var rsaDeformatter = new RSAPKCS1SignatureDeformatter(rsa);
                    rsaDeformatter.SetHashAlgorithm("SHA256");
                    return rsaDeformatter.VerifySignature(hashOfDataToSign, signature);
                }
            }
            catch { return false; }
        }
        public string get_hash()
        {
            MD5 md5 = new MD5CryptoServiceProvider();
            UnicodeEncoding byteConverter = new UnicodeEncoding();
            AssignPublicKey();
            string str = getUniqueID("") + RetrieveComputerProps();
           // Console.WriteLine(str);
            return BitConverter.ToString(md5.ComputeHash(Encoding.UTF8.GetBytes(str))).Replace("-", String.Empty);
        }
        public bool Check_Only()
        {
           
            string hash_summ = get_hash();
            byte[] asshash = Encoding.UTF8.GetBytes(hash_summ);
            //Console.WriteLine(hash_summ);
            if (File.Exists("Signature.bin") == false)
                return false;
            byte[] tocheck = File.ReadAllBytes("Signature.bin");
            if (VerifySignature(asshash, tocheck))
                return true;    //allow
            else
                return false;   //denied
        }
    }

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