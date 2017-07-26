using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Autopost
{
    
    
    public partial class Welcome : Form
    {
        public List<Post> Posts { get; set; }

        public Welcome()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            PostSelect newForm = new PostSelect();
            this.Hide();
            newForm.ShowDialog();
            this.Close();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            Autopost_Post_Window1 newForm = new Autopost_Post_Window1();
            this.Hide();
            newForm.ShowDialog();
            this.Close();
        }
    }
}
