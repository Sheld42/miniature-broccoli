﻿using System;
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
        public void AssignPublicKey()
        {
            try
            {
                ww.Exponent = File.ReadAllBytes("exp.bin");
                ww.Modulus = File.ReadAllBytes("Modulus.bin");
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
            AssignPublicKey();
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
            if (vs(asshash, eeq))
                return true;    //allow
            else
                return false;   //denied
        }
    }

}