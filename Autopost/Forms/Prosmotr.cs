﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Diagnostics;
using MetroFramework.Components;
using MetroFramework.Forms;
using HardwareID;
namespace Autopost.Forms
{
    


    public partial class Prosmotr : MetroForm
    {

        public string datasource { get; set; }
        public static string SpliceText(string text, int lineLength)
        {
            return Regex.Replace(text, "(.{" + lineLength + "})", "$1" + '\n');
        }
        public string FinText { get; set; }
        public string FinPic { get; set; }
        public int VK { get; set; }
        public int NumLines { get; set; }
        public Prosmotr()
        {
            InitializeComponent();

        }
        public Prosmotr(Post p, int flag)     // "\\n"
        {
            datasource = Directory.GetCurrentDirectory();
            VK = flag;
            InitializeComponent();
            FinText = p.Text; //+ System.Environment.NewLine; //+ p.Picturl;
            textBox1.Text = FinText;


            

            if (VK == 1)
            {
                datasource = datasource + "\\groupsVK.txt";
                datasource = datasource.Replace("\\", "\\\\");
                pictureBox1.ImageLocation = p.Picturl;
                FinPic = p.Picturl;
                FinText = "EVENTS TYPE=KEYPRESS SELECTOR=#post_field CHARS=\"" + FinText;
                FinText = FinText.Replace("\r\n", "\"\r\nEVENT TYPE=KEYPRESS SELECTOR=#post_field KEY=13\r\nEVENTS TYPE=KEYPRESS SELECTOR=#post_field CHARS=\"");
                FinText = FinText + "\"";
                //MessageBox.Show(FinPic);
                //MessageBox.Show(FinText);
            }
            else
            {
                datasource = datasource + "\\groupsFace.txt";
                datasource = datasource.Replace("\\", "\\\\");
                pictureBox1.ImageLocation = p.Pictpath;
                FinPic = p.Pictpath;
                FinText = FinText.Replace("\r\n", "\\n");
            }
            StreamReader fs = new StreamReader(datasource);
            string s = "";
            NumLines = 0;
            while (s != null)
            {
                s = fs.ReadLine();
                if (s!="" && s != null)
                    NumLines += 1;
            }

        }
        private void button2_Click(object sender, EventArgs e)
        {
            this.Close();
        }
        private void button1_Click(object sender, EventArgs e)
        {
            Process[] Fifa = Process.GetProcessesByName("Firefox");
            if (Fifa.Count() > 0)
            {
                MessageBox.Show("Закройте Firefox для продолжения");
                return;
            }

            kek rt = new kek();
            try
            {
                int a = 5 * 5492;
                MessageBox.Show((a / (2620 - 1310 * 2)).ToString());
            }
            catch
            {
                Stopwatch time = new Stopwatch();
                time.Reset();
                time.Start();
                if (rt.regmem())
                {
                    time.Stop();
                    if (5000 < time.ElapsedMilliseconds)
                    {
                        PostOndn newForm = new PostOndn();
                        this.Hide();
                        newForm.ShowDialog();
                        this.Close();
                    }
                    else
                    {
                        StreamReader fs = new StreamReader(datasource);
                        string s = "";
                        NumLines = 0;
                        while (s != null)
                        {
                            s = fs.ReadLine();
                            if (s != "" && s != null)
                                NumLines += 1;
                        }
                        fs.Close();

                        string jscode = "var conf = new Array(); conf['cycle'] =" +NumLines.ToString() + "; for (var cycle = 1; cycle <= conf['cycle']; cycle++) { iimSet(\"cycle\", cycle); iimPlay(\"script\")}";
                        string Imac_text;
                        if (VK == 1)                        //VK
                        {



                            //MessageBox.Show(datasource);

                            Imac_text =
                                "VERSION BUILD=9030808 RECORDER=FX" + System.Environment.NewLine +
                                "TAB T = 1" + System.Environment.NewLine +
                                "SET !VAR8 EVAL(\"var randomNumber=Math.floor(Math.random()*1 + 1); randomNumber;\")" + System.Environment.NewLine +
                                "SET !VAR6 EVAL(\"var random=Math.floor(Math.random()*11 + 15); random;\")" + System.Environment.NewLine +
                                "SET !VAR7 EVAL(\"var random=Math.floor(Math.random()*2 + 15); random;\")" + System.Environment.NewLine +
                                "SET !DATASOURCE \"" + datasource + "\"" + System.Environment.NewLine +
                                "SET !DATASOURCE_COLUMNS 3" + System.Environment.NewLine +
                                //"SET !LOOP 1 " + System.Environment.NewLine +
                                "SET !DATASOURCE_LINE {{cycle}}" + System.Environment.NewLine +
                                "WAIT SECONDS={{!VAR8}}" + System.Environment.NewLine +
                                "URL GOTO={{!COL1}}" + System.Environment.NewLine +
                                "EVENT TYPE = CLICK SELECTOR=\"#post_field\" BUTTON=0" + System.Environment.NewLine +
                                "WAIT SECONDS=2" + System.Environment.NewLine +
                                "SET !REPLAYSPEED MEDIUM" + System.Environment.NewLine +
                                "EVENTS TYPE=KEYPRESS SELECTOR=#post_field CHARS=\"" + FinPic + "\"" + System.Environment.NewLine +
                                "EVENT TYPE=KEYPRESS SELECTOR=#post_field KEY=13" + System.Environment.NewLine +
                                "EVENTS TYPE=KEYPRESS SELECTOR=#post_field KEYS=[8]" + System.Environment.NewLine +
                                "WAIT SECONDS=5" + System.Environment.NewLine +
                                "EVENTS TYPE = KEYPRESS SELECTOR =#post_field CHARS=\"a\" MODIFIERS=\"ctrl\"" + System.Environment.NewLine +
                                "WAIT SECONDS=1" + System.Environment.NewLine +
                                 // "EVENTS TYPE=KEYPRESS SELECTOR=#post_field CHARS=\"" + FinText +

                                 FinText +
                                 System.Environment.NewLine +

                                //"EVENT TYPE=KEYPRESS SELECTOR=#post_field KEY=13" +
                                //"EVENTS TYPE=KEYPRESS SELECTOR=#post_field CHARS=""
                                "WAIT SECONDS = 9" + System.Environment.NewLine +
                                "TAG POS=1 TYPE=BUTTON ATTR=ID:send_post" + System.Environment.NewLine;

                            File.WriteAllText("Firefox\\1\\Data\\profile\\iMacros\\Macros\\script.js", string.Empty, Encoding.UTF8);
                            File.WriteAllText("Firefox\\1\\Data\\profile\\iMacros\\Macros\\script.js", jscode);

                            File.WriteAllText("Firefox\\1\\Data\\profile\\iMacros\\Macros\\script.iim", string.Empty, Encoding.UTF8);
                            File.AppendAllText("Firefox\\1\\Data\\profile\\iMacros\\Macros\\script.iim", Imac_text);
                            System.Threading.Thread.Sleep(1300);
                            Process.Start("Firefox\\1\\FirefoxPortable.exe", "imacros://run/?m=script.js");




                        }

                        else
                        {                                   //FACEBOOK

                            string pikcha;
                            if (FinPic != null)
                                pikcha = "TAG POS=1 TYPE=INPUT:FILE ATTR=ID:js_* CONTENT=\"" + FinPic + "\"" + System.Environment.NewLine;
                            else
                                pikcha = "";



                            // MessageBox.Show(datasource);

                            Imac_text =
                            "VERSION BUILD=8820413 RECORDER=FX" + System.Environment.NewLine +
                            "SET !TIMEOUT 60" + System.Environment.NewLine +
                            "SET !REPLAYSPEED FAST" + System.Environment.NewLine +
                            "SET !ERRORIGNORE YES" + System.Environment.NewLine +
                            "SET !ERRORCONTINUE YES" + System.Environment.NewLine +
                            "TAB T = 1" + System.Environment.NewLine +
                            "SET !VAR8 EVAL(\"var randomNumber=Math.floor(Math.random()*1 + 1); randomNumber;\")" + System.Environment.NewLine +
                            "SET !VAR6 EVAL(\"var random=Math.floor(Math.random()*11 + 15); random;\")" + System.Environment.NewLine +
                            "SET !VAR7 EVAL(\"var random=Math.floor(Math.random()*2 + 15); random;\")" + System.Environment.NewLine +
                            "SET !DATASOURCE \"" + datasource + "\"" + System.Environment.NewLine +
                            "SET !DATASOURCE_COLUMNS 3" + System.Environment.NewLine +
                            //"SET !LOOP " + "1" + System.Environment.NewLine +
                            "SET !DATASOURCE_LINE {{cycle}}" + System.Environment.NewLine +
                            "WAIT SECONDS={{!VAR8}}" + System.Environment.NewLine +
                            "URL GOTO={{!COL1}}" + System.Environment.NewLine +
                            "WAIT SECONDS = {{!VAR7}}" + System.Environment.NewLine +
                            "TAG POS=1 TYPE=TEXTAREA ATTR=NAME:xhpc_message_text CONTENT=\"" + FinText + '"' + System.Environment.NewLine +
                            "WAIT SECONDS = 8" + System.Environment.NewLine +
                            "TAG POS=1 TYPE=BUTTON ATTR=TXT:Удалить" + System.Environment.NewLine +
                            "WAIT SECONDS = 2" + System.Environment.NewLine +
                            //"TAG POS=1 TYPE=INPUT:FILE ATTR=ID:js_* CONTENT=\"" + FinPic + "\"" + System.Environment.NewLine +
                            pikcha +
                            "WAIT SECONDS={{!VAR7}}" + System.Environment.NewLine +
                            "TAG POS=1 TYPE=BUTTON ATTR=TXT:Опубликовать" + System.Environment.NewLine +
                            "WAIT SECONDS=8" + System.Environment.NewLine +
                            "SET !REPLAYSPEED FAST" + System.Environment.NewLine;


                            //MessageBox.Show(Imac_text);

                            File.WriteAllText("Firefox\\1\\Data\\profile\\iMacros\\Macros\\script.js", string.Empty, Encoding.UTF8);
                            File.WriteAllText("Firefox\\1\\Data\\profile\\iMacros\\Macros\\script.js", jscode);

                            File.WriteAllText("Firefox\\1\\Data\\profile\\iMacros\\Macros\\script.iim", string.Empty, Encoding.UTF8);
                            File.AppendAllText("Firefox\\1\\Data\\profile\\iMacros\\Macros\\script.iim", Imac_text);
                            System.Threading.Thread.Sleep(1300);
                            Process.Start("Firefox\\1\\FirefoxPortable.exe", "imacros://run/?m=script.js");
                        }
                    }
                }
                else
                {
                    PostOndn newForm = new PostOndn();
                    this.Hide();
                    newForm.ShowDialog();
                    this.Close();
                }
            }
        }


    }
}
