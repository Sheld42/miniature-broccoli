﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Runtime.CompilerServices;
using Autopost.Forms;
using System.Diagnostics;
using HardwareID;
using MetroFramework.Components;
using MetroFramework.Forms;
namespace Autopost
{
    public partial class Autopost_Post_Window1 : MetroForm, INotifyPropertyChanged
    {
        private string _title;
        public string Title
        {
            get { return _title; }
            set
            {
                _title = value;
                OnPropertyChanged();
            }
        }
        public string Textpost { get; set; }
        public string Picturl { get; set; }
        public string Pictpath { get; set; }
        public List<Post> Posts { get; set; }
        public Autopost_Post_Window1()                         //Инициализация окна
        {
            Posts = new List<Post>();
            InitializeComponent();
            LoadPosts();                            //Загрузка из файла
            comboBox2.DisplayMember = "Title";
        }
        public event PropertyChangedEventHandler PropertyChanged;
        public void OnPropertyChanged([CallerMemberName]string prop = "")
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(prop));
        }
        private void PostFromCombo()
        {
            Post p = comboBox2.SelectedItem as Post;

            textBox1.Text = p.Title;
            textBox4.Text = p.Text;
            //pictureBox1.ImageLocation = p.Pictpath;
            textBox3.Text = p.Picturl;

        }
        private void AddPost()              //Добавление поста в список (внутри памяти проги)
        {
            Post NewPost = new Post();
            NewPost.Title = Title;
            NewPost.Text = Textpost;
            NewPost.Picturl = Picturl;
            NewPost.Pictpath = Pictpath;

            Posts.Add(NewPost);
        }
        private void SaveToJson()          //Сохранение в джсон на локал диск
        {
            try
            {
                File.WriteAllText("PostsVK.json", string.Empty);
                DataContractJsonSerializer jsonFormatter = new DataContractJsonSerializer(typeof(Post[]));
                using (FileStream fs = new FileStream("PostsVK.json", FileMode.OpenOrCreate))
                {
                    jsonFormatter.WriteObject(fs, Posts.ToArray());
                }
            }
            catch { MessageBox.Show("Ошибка обработки файла PostsVK.json", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error); }
        }
        private void LoadPosts()            //Загрузка постов из джсон
        {
            try
            {
                Posts.Clear();
                DataContractJsonSerializer jsonFormatter = new DataContractJsonSerializer(typeof(Post[]));
                using (FileStream fs = new FileStream("PostsVK.json", FileMode.OpenOrCreate))
                {
                    Post[] newpost = (Post[])jsonFormatter.ReadObject(fs);
                    foreach (Post p in newpost)
                    {
                        Posts.Add(p);
                    }
                }
                comboBox2.Items.Clear();
                while (comboBox2.Items.Count > 0)
                    comboBox2.Items.RemoveAt(0);
                Post empty = new Post();
                empty.Text = "";
                empty.Pictpath = "";
                empty.Title = "";
                empty.Picturl = "";
                comboBox2.Items.Add(empty);
                foreach (Post p in Posts)
                    comboBox2.Items.Add(p);
                if (Posts.Count > 0)
                {
                    comboBox2.SelectedIndex = 0;
                    PostFromCombo();
                }
            }
            catch { MessageBox.Show("Ошибка загрузки постов из файла PostsVK.json", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error); }
        }
        private void button1_Click(object sender, EventArgs e)      //Начать рассылку
        {

            Post p = new Post();
            p.Text = Textpost;
            p.Title = Title;
            p.Picturl = Picturl;
            p.Pictpath = Pictpath;

            Prosmotr newForm = new Prosmotr(p, 1);
            newForm.ShowDialog();

        }
        private void textBox1_TextChanged(object sender, EventArgs e)   //title
        {
            Title = textBox1.Text;
        }
        private void textBox4_TextChanged(object sender, EventArgs e)   //text
        {
            Textpost = textBox4.Text;            
        }
        private void textBox2_TextChanged(object sender, EventArgs e)   //picpath
        {
            //Pictpath = textBox2.Text;
        }
        private void textBox3_TextChanged(object sender, EventArgs e)     //picurl
        {
            //Picturl = textBox3.Text;
            try
            {
                pictureBox1.ImageLocation = textBox3.Text;
                Picturl = textBox3.Text;
            }
            catch
            {
                //   MessageBox.Show("Ошибка прикрепления изображения");
            }
        }
        private void comboBox2_SelectedIndexChanged(object sender, EventArgs e)
        {
            PostFromCombo();
        }   //Загрузка поста из комбо
        private void button2_Click(object sender, EventArgs e)
        {
        }
        private void button2_Click_1(object sender, EventArgs e)        //Кнопка Удаление поста
        {
            Post Selected = new Post();
            Selected = Posts.Where(post => string.Equals(post.Text, Textpost)).FirstOrDefault();
            try
            {
                Posts.Remove(Selected);
                comboBox2.Items.Remove(Selected);
                comboBox2.SelectedIndex = 0;
                SaveToJson();
                LoadPosts();
            }
            catch { }
        }
        private void button3_Click(object sender, EventArgs e)
        {
            int k = comboBox2.Items.Count;
            AddPost();
            SaveToJson();
            LoadPosts();
            comboBox2.SelectedIndex = k;
        }

        private void button3_Click_1(object sender, EventArgs e)    //Кнопка Список групп
        {

            try
            {
                Process.Start("Notepad++\\notepad++.exe", "groupsVK.txt");
            }
            catch
            {
                MessageBox.Show("Ошибка при открытии файла групп.", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            
        }

        private void button4_Click(object sender, EventArgs e)      //Кнопка Авторизация
        {
            try
            {
                Process.Start("Firefox\\1\\FirefoxPortable.exe", "www.vk.com");
            }
            catch
            {
                MessageBox.Show("Ошибка при открытии Firefox", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            
        }

        private void button5_Click(object sender, EventArgs e)      //Кнопка Обзор картинки на компе
        {
            OpenFileDialog OPF = new OpenFileDialog();
            if (OPF.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    pictureBox1.ImageLocation = OPF.FileName.ToString();
                    Pictpath = OPF.FileName.ToString();

                }
                catch
                {
                    MessageBox.Show("Ошибка прикрепления изображения", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }

            }
        }

        private void button6_Click(object sender, EventArgs e)      //Кнопка Сохранение поста
        {
            Post Selected = new Post();
            Selected = Posts.Where(post => string.Equals(post.Text, Textpost)).FirstOrDefault();
            if (!Posts.Any(post => string.Equals(post.Text, Textpost) && string.Equals(post.Title, Title) && string.Equals(post.Picturl, Picturl) && string.Equals(post.Pictpath, Pictpath)))
            {
                try
                {
                    int k = comboBox2.Items.Count;
                    AddPost();
                    SaveToJson();
                    LoadPosts();
                    comboBox2.SelectedIndex = k;
                }
                catch
                {
                    MessageBox.Show("Ошибка при сохранении. Проверьте поля ввода.", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }

            }
        }

        private void button5_Click_1(object sender, EventArgs e)        //Кнопа "в меню"
        {
            Welcome newForm = new Welcome();
            this.Hide();
            newForm.ShowDialog();
            this.Close();
        }

        private void textBox4_KeyDown(object sender, KeyEventArgs e)        //ctrl + A
        {
            if (e.KeyData == (Keys.Control | Keys.A))
            {
                textBox4.SelectAll();
                e.Handled = e.SuppressKeyPress = true;
            }
        }
    }
}
