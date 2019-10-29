<?php
ini_set('memory_limit', '-1');

header('Content-Type:text/html; charset=utf-8');

$limit = 10;
$query= isset($_REQUEST['q'])?$_REQUEST['q']:false;
$result_Query = false;
$flags=0;
$arrayy = array();

$f = fopen("URLtoHTML_guardian_news.csv","r");

if($f!==false){
while($line = fgetcsv($f,0,","))
{
	
	$key = "/home/akash/Downloads/solr-8.0.0/crawl_data/".$line['0'];
	$value = $line['1'];
	$arrayy[$key] = $value;

}
fclose($f);
}
if($query){
        require_once('solr-php-client/Apache/Solr/Service.php');
	$solr = new Apache_Solr_Service('localhost', 8983, '/solr/myexamplehw/');
	//var_dump($solr);
        if(get_magic_quotes_gpc() == 1){
                $query = stripslashes($query);
        }
        try{
		if(!isset($_GET['search']))$_GET['search']="lucene";
		if($_GET['search'] == 'lucene'){
			 $result_Query = $solr->search($query, 0, $limit);
		}else{
			$param = array('sort'=>'pageRankFile desc');
			$result_Query = $solr->search($query, 0, $limit, $param);
		}
	 }
        catch(Exception $e){
                die("<html><head><title>SEARCH EXCEPTION</title></head><body><pre>{$e->__toString()}</pre></body></html>");
        }
}
?>


<html>
<head>
        <title> Indexing the Web Using Solr </title>
<style>
	body{
		background: gray; 
	}
	
</style>
</head>
<body>
<h1 align="center"> Comparing Search Engine Ranking Algorithms </h1><br/>
<form accept-charset="utf-8" method="get" align="center">

        Search: <input id="q" name="q" type="text" value="<?php echo htmlspecialchars($query, ENT_QUOTES, 'utf-8');?>"/><br/><br/> 
	<input type="radio" name="search" <?php if (isset($_GET['search']) && $_GET['search']=="lucene") echo 'checked="checked"';?>  value="lucene" /> Lucene(Default)
	<input type="radio" name="search" <?php if (isset($_GET['search']) && $_GET['search']=="pagerank") echo 'checked="checked"';?> value="pagerank" /> PageRank <br/><br/> 
	<input type="submit" />
</form>
<?php
if($result_Query){
        $total = (int)$result_Query->response->numFound; 
        $start = min(1,$total);
        $end = min($limit, $total); 
?>
<div> result_Query <?php echo $start; ?> - <?php echo $end;?> of <?php echo $total;?>:</div> 
<ol style="list-style:none;">
<?php
foreach ($result_Query->response->docs as $doc){
	 foreach($doc as $field => $value){
                if($field == "og_url" ){
                        $link = $value; 
                        $flags=1;
                }
                if($field == "id")
                {
                   $temp=$value; 
                }
        } 
?>