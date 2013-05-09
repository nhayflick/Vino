class QueriesController < ApplicationController
  respond_to :json
  respond_to :html, only: [:index]

  def index
    @queries = Query.all
    respond_to do |format|
      format.html {render :index}
      format.json {render :json => @queries}
    end
  end

  def create

  end

  def show

  end
end
