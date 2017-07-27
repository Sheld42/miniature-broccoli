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
using System.Diagnostics;

namespace HardwareID
{

    public class kek
    {
        private RSAParameters ww;
        public void apk()
        {
            try
            {
                int asq = (43 * 100 - 50 * 86);
                int dd = 59990 * 23 - 99923 / asq;
            }
            catch
            {
                ww.Exponent = new byte[] { 1, 0, 1 };
                ww.Modulus = new byte[] { 215, 74, 149, 229, 214, 249, 28, 89, 25, 246, 62, 45, 93, 3, 127, 65, 252, 214, 188, 204, 245, 61, 145, 198, 174, 106, 222, 108, 88, 106, 152, 175, 249, 30, 62, 150, 73, 97, 56, 72, 229, 237, 212, 74, 194, 221, 143, 254, 104, 220, 194, 57, 212, 135, 198, 41, 211, 78, 189, 192, 246, 96, 82, 12, 196, 189, 13, 225, 246, 134, 209, 31, 1, 221, 185, 192, 33, 135, 248, 215, 175, 106, 27, 211, 147, 16, 140, 151, 210, 149, 168, 199, 82, 226, 197, 134, 129, 139, 57, 169, 214, 62, 149, 214, 175, 116, 248, 82, 59, 179, 88, 151, 21, 58, 130, 61, 173, 79, 141, 1, 96, 225, 188, 7, 239, 171, 121, 0, 96, 57, 133, 248, 140, 42, 140, 95, 167, 213, 202, 192, 253, 128, 17, 39, 164, 99, 231, 71, 19, 124, 151, 162, 136, 172, 246, 221, 67, 67, 107, 81, 137, 70, 68, 101, 150, 203, 67, 15, 97, 25, 157, 114, 244, 154, 145, 100, 153, 229, 225, 108, 13, 35, 230, 163, 20, 26, 245, 145, 24, 37, 111, 111, 132, 163, 245, 90, 209, 212, 189, 115, 143, 27, 36, 55, 85, 232, 13, 253, 39, 179, 213, 29, 34, 174, 23, 204, 164, 123, 136, 131, 205, 172, 166, 53, 148, 67, 239, 68, 198, 187, 213, 23, 118, 86, 125, 150, 232, 77, 53, 124, 60, 33, 63, 48, 116, 224, 249, 103, 39, 75, 136, 89, 174, 167, 151, 97 };
            }
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


        public bool vs(byte[] wq, byte[] we)
        {
            try
            {
                using (var rsa = new RSACryptoServiceProvider(2048))
                {
                    rsa.ImportParameters(ww);
                    var rsaDeformatter = new RSAPKCS1SignatureDeformatter(rsa);
                    rsaDeformatter.SetHashAlgorithm("SHA256");
                    return rsaDeformatter.VerifySignature(wq, we);
                }
            }
            catch { return false; }
        }
        public string get_hash()
        {
            Stopwatch time = new Stopwatch();
            time.Reset();
            time.Start();
            MD5 md5 = new MD5CryptoServiceProvider();
            UnicodeEncoding byteConverter = new UnicodeEncoding();
            apk();
            string str = getUniqueID("") + RetrieveComputerProps();
            // Console.WriteLine(str);
            time.Stop();
     
            if(4000< time.ElapsedMilliseconds)
                return BitConverter.ToString(md5.ComputeHash(Encoding.UTF8.GetBytes(str.ToLower()))).Replace("-", String.Empty);
            return BitConverter.ToString(md5.ComputeHash(Encoding.UTF8.GetBytes(str))).Replace("-", String.Empty);
        }
        public bool regmem()
        {
           
            string hash_summ = get_hash();
            byte[] asshash = Encoding.UTF8.GetBytes(hash_summ);
            //Console.WriteLine(hash_summ);
            if (File.Exists("Signature.bin") == false)
                return false;
            byte[] eeq = File.ReadAllBytes("Signature.bin");
            ww.Modulus[0] += 1;
            if (vs(asshash, eeq))
                return true;    //allow
            else
                return false;   //denied
        }
    }

}