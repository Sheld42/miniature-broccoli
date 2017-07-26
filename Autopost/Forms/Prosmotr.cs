using System;
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

namespace Autopost.Forms
{
    public partial class Prosmotr : Form
    {
        public static string SpliceText(string text, int lineLength)
        {
            return Regex.Replace(text, "(.{" + lineLength + "})", "$1" + '\n');
        }
        public string FinText { get; set; }
        public string FinPic { get; set; }
        public int VK { get; set; }
        public Prosmotr()
        {
            InitializeComponent();

        }
        public Prosmotr(Post p, int flag)     // "\\n"
        {
            VK = flag;
            InitializeComponent();
            FinText = p.Text; //+ System.Environment.NewLine; //+ p.Picturl;
            textBox1.Text = FinText;
            
            pictureBox1.ImageLocation = p.Pictpath;

            if (VK == 1)
            {
                FinPic = p.Picturl;
                FinText = FinText.Replace("\r\n", "\\nEVENT TYPE=KEYPRESS SELECTOR=#post_field KEY=13\\n");
                MessageBox.Show(FinPic);
                MessageBox.Show(FinText);
            }
            else
            {
                FinPic = p.Pictpath;
                FinText = FinText.Replace("\r\n", "\\n");
            }
            //.Replace("\\", "\\\\");
            /*string datasource = Directory.GetCurrentDirectory();
            datasource = datasource + "\\groupsFace.txt";*/
            //MessageBox.Show("SET !DATASOURCE " + datasource + "\"");
        }
        private void button2_Click(object sender, EventArgs e)
        {
            this.Close();
        }
        private void button1_Click(object sender, EventArgs e)
        {


            string Imac_text;
            if (VK == 1)                        //VK
            {

                string datasource = Directory.GetCurrentDirectory();
                datasource = datasource + "\\groupsVK.txt";

                Imac_text =
                    "VERSION BUILD=9030808 RECORDER=FX" + System.Environment.NewLine +
                    "TAB T = 1" + System.Environment.NewLine +
                    "SET !VAR8 EVAL(\"var randomNumber=Math.floor(Math.random()*1 + 1); randomNumber;\")" + System.Environment.NewLine +
                    "SET !VAR6 EVAL(\"var random=Math.floor(Math.random()*11 + 15); random;\")" + System.Environment.NewLine +
                    "SET !VAR7 EVAL(\"var random=Math.floor(Math.random()*2 + 15); random;\")" + System.Environment.NewLine +
                    "SET !DATASOURCE C:\\AutoFB\\groupsVK.txt" + System.Environment.NewLine +
                    "SET !DATASOURCE_COLUMNS 3" + System.Environment.NewLine +
                    "SET !LOOP 1 " + System.Environment.NewLine +
                    "SET !DATASOURCE_LINE {{!LOOP}}" + System.Environment.NewLine +
                    "WAIT SECONDS={{!VAR8}}" + System.Environment.NewLine +
                    "URL GOTO={{!COL1}}" + System.Environment.NewLine +
                    "EVENT TYPE = CLICK SELECTOR=\"#post_field\" BUTTON=0" + System.Environment.NewLine +
                    "WAIT SECONDS=2" + System.Environment.NewLine +
                    "SET !REPLAYSPEED MEDIUM" + System.Environment.NewLine +
                    "EVENTS TYPE=KEYPRESS SELECTOR=#post_field CHARS=" + FinPic + "\"" + System.Environment.NewLine +
                    "EVENT TYPE=KEYPRESS SELECTOR=#post_field KEY=13" + System.Environment.NewLine +
                    "EVENTS TYPE=KEYPRESS SELECTOR=#post_field KEYS=[8]" + System.Environment.NewLine +
                    "WAIT SECONDS=5" + System.Environment.NewLine +
                    "EVENTS TYPE = KEYPRESS SELECTOR =#post_field CHARS=\"a\" MODIFIERS=\"ctrl\"" + System.Environment.NewLine +
                    "WAIT SECONDS=1" + System.Environment.NewLine +
                    "EVENTS TYPE=KEYPRESS SELECTOR=#post_field CHARS=\"" + //текст

                                                                           //"EVENT TYPE=KEYPRESS SELECTOR=#post_field KEY=13" +
                                                                           //"EVENTS TYPE=KEYPRESS SELECTOR=#post_field CHARS=""
                    "WAIT SECONDS = 9" + System.Environment.NewLine +
                    "TAG POS=1 TYPE=BUTTON ATTR=ID:send_post" + System.Environment.NewLine;






            }

            else
            {                                   //FACEBOOK
                string datasource = Directory.GetCurrentDirectory();
                datasource = datasource + "\\groupsFace.txt";

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
                "SET !DATASOURCE " + datasource + "\"" + System.Environment.NewLine +
                "SET !DATASOURCE_COLUMNS 3" + System.Environment.NewLine +
                "SET !LOOP " + "1" + System.Environment.NewLine +
                "SET !DATASOURCE_LINE {{!LOOP}}" + System.Environment.NewLine +
                "WAIT SECONDS={{!VAR8}}" + System.Environment.NewLine +
                "URL GOTO={{!COL1}}" + System.Environment.NewLine +
                "WAIT SECONDS = {{!VAR7}}" + System.Environment.NewLine +
                "TAG POS=1 TYPE=TEXTAREA ATTR=NAME:xhpc_message_text CONTENT=\"" + FinText + '"' + System.Environment.NewLine +
                "WAIT SECONDS = 8" + System.Environment.NewLine +
                "TAG POS=1 TYPE=BUTTON ATTR=TXT:Удалить" + System.Environment.NewLine +
                "WAIT SECONDS = 2" + System.Environment.NewLine +
                "TAG POS=1 TYPE=INPUT:FILE ATTR=ID:js_* CONTENT=\"" + FinPic + "\"" + System.Environment.NewLine +
                "WAIT SECONDS={{!VAR7}}" + System.Environment.NewLine +
                "TAG POS=1 TYPE=BUTTON ATTR=TXT:Опубликовать" + System.Environment.NewLine +
                "WAIT SECONDS=8" + System.Environment.NewLine +
                "SET !REPLAYSPEED FAST" + System.Environment.NewLine;




                File.WriteAllText("Firefox\\1\\Data\\profile\\iMacros\\Macros\\face.iim", string.Empty, Encoding.UTF8);
                File.AppendAllText("Firefox\\1\\Data\\profile\\iMacros\\Macros\\face.iim", Imac_text);
                System.Threading.Thread.Sleep(1300);
                Process.Start("Firefox\\1\\FirefoxPortable.exe", "imacros://run/?m=face.iim");
            }
        }


    }
}
