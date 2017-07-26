using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Diagnostics;

namespace Autopost
{
    public partial class AuthorizeVK : Form
    {
        public AuthorizeVK()
        {
            InitializeComponent();
        }
        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                Process.Start("C:\\AutoFB\\Firefox\\1\\FirefoxPortable.exe", "www.facebook.com");
            }
            catch
            {
                MessageBox.Show("Ошибка при открытии Firefox");
            }
        }
        private void button2_Click(object sender, EventArgs e)
        {
            PostSelect newForm = new PostSelect();
            this.Hide();
            newForm.ShowDialog();
            this.Close();
        }
    }
}
