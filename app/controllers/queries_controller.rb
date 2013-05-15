class QueriesController < ApplicationController
  respond_to :json
  respond_to :html, only: [:index]

  # The Queries controller keeps records of all incoming search queries

  def index
    @queries = Query.all
    respond_to do |format|
      format.html {render :index}
      format.json {render :json => @queries}
    end
  end

  def create
    @query = Query.new(params[:query])
    if @query.save
      render :json => @query
    else
      render :json => @query.errors, :status => 422
    end
  end
end
